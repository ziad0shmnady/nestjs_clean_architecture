import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { Logger } from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const err = exception.getResponse();

    let message: string;

    // Check if err is an object with a message property
    if (typeof err === 'object' && (err as any).message) {
      message = (err as any).message;
    } else if (typeof err === 'string') {
      message = err;
    } else {
      message = 'Error when trying to save resource into the DB';
    }

    // Log the error
    this.logger.error(
      `HTTP Exception: ${message}`,
      undefined,
      HttpExceptionFilter.name,
    );

    // Provide environment-based error messages
    if (process.env.NODE_ENV === 'production') {
      message = 'Something went wrong. Please try again later.';
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      message,
    });
  }
}
