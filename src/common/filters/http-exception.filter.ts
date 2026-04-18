import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import type { Response } from 'express';

import type { HttpExceptionResponseBody } from '../exceptions/http-exception-response.interface';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();
    const { statusCode, message, errors } = this.normalizeException(exception);

    response.status(statusCode).json({
      success: false,
      statusCode,
      message,
      errors,
    });
  }

  private normalizeException(exception: unknown): {
    statusCode: number;
    message: string;
    errors: string[];
  } {
    if (exception instanceof HttpException) {
      const statusCode = exception.getStatus();
      const response = exception.getResponse();

      if (typeof response === 'string') {
        return {
          statusCode,
          message: response,
          errors: [],
        };
      }

      const exceptionBody = response as HttpExceptionResponseBody;
      const message =
        typeof exceptionBody.message === 'string'
          ? exceptionBody.message
          : exceptionBody.message?.[0] ?? exception.message;

      return {
        statusCode,
        message,
        errors: exceptionBody.errors ?? this.normalizeErrors(exceptionBody.message),
      };
    }

    if (exception instanceof Error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: exception.message,
        errors: [],
      };
    }

    return {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
      errors: [],
    };
  }

  private normalizeErrors(message: string | string[] | undefined): string[] {
    if (Array.isArray(message)) {
      return message;
    }

    return [];
  }
}
