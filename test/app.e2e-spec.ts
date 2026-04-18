import {
  BadRequestException,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import type { INestApplication } from '@nestjs/common';
import type { TestingModule } from '@nestjs/testing';
import type { ValidationError } from 'class-validator';
import request from 'supertest';

import { AppModule } from '../src/app.module';
import { VALIDATION_FAILED_MESSAGE } from '../src/common/constants/http-message.constants';
import { HttpExceptionFilter } from '../src/common/filters/http-exception.filter';
import { ResponseTransformInterceptor } from '../src/common/interceptors/response-transform.interceptor';
import { flattenValidationErrors } from '../src/common/utils/flatten-validation-errors';
import type { AppConfig } from '../src/config/app.config';

describe('Application (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    const configService = app.get(ConfigService);
    const appConfig = configService.getOrThrow<AppConfig>('app');

    app.setGlobalPrefix(appConfig.apiPrefix);
    app.enableVersioning({
      type: VersioningType.URI,
      defaultVersion: '1',
    });
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

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /api/v1/health returns the wrapped health response', async () => {
    const httpServer = app.getHttpServer() as Parameters<typeof request>[0];
    const response = await request(httpServer).get('/api/v1/health').expect(200);
    const responseBody = response.body as {
      success: boolean;
      message: string;
      data: {
        status: string;
        timestamp: string;
      };
    };

    expect(responseBody).toMatchObject({
      success: true,
      message: 'OK',
      data: {
        status: 'ok',
      },
    });
    expect(typeof responseBody.data.timestamp).toBe('string');
  });

  it('POST /api/v1/example validates payloads', async () => {
    const httpServer = app.getHttpServer() as Parameters<typeof request>[0];
    const response = await request(httpServer)
      .post('/api/v1/example')
      .send({
        name: 'x',
      })
      .expect(400);

    expect(response.body).toEqual({
      success: false,
      statusCode: 400,
      message: 'Validation failed',
      errors: ['name must be longer than or equal to 2 characters'],
    });
  });
});
