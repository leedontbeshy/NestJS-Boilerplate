import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, map } from 'rxjs';

import { DEFAULT_SUCCESS_MESSAGE } from '../constants/http-message.constants';
import { RESPONSE_MESSAGE_METADATA } from '../decorators/response-message.decorator';

interface SuccessResponse<T> {
  success: true;
  message: string;
  data: T;
}

@Injectable()
export class ResponseTransformInterceptor<T>
  implements NestInterceptor<T, SuccessResponse<T> | T>
{
  constructor(private readonly reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<SuccessResponse<T> | T> {
    const responseMessage =
      this.reflector.getAllAndOverride<string | undefined>(RESPONSE_MESSAGE_METADATA, [
        context.getHandler(),
        context.getClass(),
      ]) ?? DEFAULT_SUCCESS_MESSAGE;

    return next.handle().pipe(
      map((data) => {
        if (this.isWrappedResponse(data)) {
          return data;
        }

        return {
          success: true,
          message: responseMessage,
          data,
        };
      }),
    );
  }

  private isWrappedResponse(data: unknown): data is SuccessResponse<T> {
    return (
      typeof data === 'object' &&
      data !== null &&
      'success' in data &&
      'message' in data &&
      'data' in data
    );
  }
}
