import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    /* if (status === 404) {
      response.status(status).json(exception.getResponse());
    } */
    if (status === 400) {
      const errorMessage: ErrorsMessageType = {
        errors: [],
      };
      const responseBody: any = exception.getResponse();
      responseBody.message.forEach((m) => {
        errorMessage.errors.push(m);
      });
      response.status(status).json(errorMessage);
    } else {
      response.status(status).json(exception.message);
    }
  }
}

export type ErrorsMessageType = {
  errors: ErrorType[];
};

type ErrorType = {
  message: string;
  field: string;
};
