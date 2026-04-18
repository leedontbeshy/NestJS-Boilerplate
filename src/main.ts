import { BadRequestException, Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import type { ValidationError } from 'class-validator';

import { AppModule } from './app.module';
import { DEFAULT_SUCCESS_MESSAGE, VALIDATION_FAILED_MESSAGE } from './common/constants/http-message.constants';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ResponseTransformInterceptor } from './common/interceptors/response-transform.interceptor';
import { flattenValidationErrors } from './common/utils/flatten-validation-errors';
import type { AppConfig } from './config/app.config';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const configService = app.get(ConfigService);
  const appConfig = configService.getOrThrow<AppConfig>('app');

  app.setGlobalPrefix(appConfig.apiPrefix);
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });
  app.enableCors({
    origin: appConfig.corsOrigin,
    credentials: true,
  });
  app.enableShutdownHooks();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      exceptionFactory: (validationErrors: ValidationError[]) =>
        new BadRequestException({
          message: VALIDATION_FAILED_MESSAGE,
          errors: flattenValidationErrors(validationErrors),
        }),
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new ResponseTransformInterceptor(app.get(Reflector)));

  const swaggerConfig = new DocumentBuilder()
    .setTitle(appConfig.name)
    .setDescription('REST API starter template built with NestJS.')
    .setVersion(appConfig.version)
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Paste a future JWT access token here once auth is added.',
      },
      'bearer',
    )
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(`${appConfig.apiPrefix}/docs`, app, swaggerDocument, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  await app.listen(appConfig.port);

  const applicationUrl = await app.getUrl();
  const logger = new Logger('Bootstrap');

  logger.log(`Application is running on ${applicationUrl}/${appConfig.apiPrefix}`);
  logger.log(`Swagger docs available at ${applicationUrl}/${appConfig.apiPrefix}/docs`);
  logger.log(`Default success message: ${DEFAULT_SUCCESS_MESSAGE}`);
}

void bootstrap();
