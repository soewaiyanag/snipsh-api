import { STATUS_CODES } from 'node:http';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const http = host.switchToHttp();
    const request = http.getRequest<Request>();
    const response = http.getResponse<Response>();

    const isHttpError = exception instanceof HttpException;
    const statusCode = isHttpError
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    if (!isHttpError) {
      this.logger.error(
        `${request.method} ${request.url}`,
        exception instanceof Error ? exception.stack : String(exception),
      );
    }

    response.status(statusCode).json({
      statusCode,
      error: STATUS_CODES[statusCode],
      message: isHttpError
        ? this.messageOf(exception)
        : STATUS_CODES[HttpStatus.INTERNAL_SERVER_ERROR],
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }

  // validation errors send an array of messages, other errors send one string
  private messageOf(exception: HttpException): string | string[] {
    const body = exception.getResponse();
    if (typeof body === 'string') {
      return body;
    }
    const { message } = body as { message?: string | string[] };
    return message ?? exception.message;
  }
}
