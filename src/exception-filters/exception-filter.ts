import { Catch, ArgumentsHost, HttpException, ExceptionFilter, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class ServiceExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    let message: string;

    if (exception instanceof NotFoundException) {
      message = 'Resource not found';
    } else if (exception instanceof UnauthorizedException) {
      message = 'Unauthorized';
    } else {
      message = 'Internal Server Error';
    }

    response.status(status).json({
      statusCode: status,
      message,
    });
  }
}
