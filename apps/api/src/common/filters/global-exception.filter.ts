import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";

import { ApiResponse } from "../api-response";

type HttpResponse = {
  status: (statusCode: number) => {
    json: (body: ApiResponse) => void;
  };
};

type HttpRequest = {
  method: string;
  url: string;
};

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<HttpResponse>();
    const request = ctx.getRequest<HttpRequest>();

    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const message = this.getMessage(exception);

    response.status(status).json({
      success: false,
      message,
      data: {
        method: request.method,
        path: request.url,
        statusCode: status,
        timestamp: new Date().toISOString()
      }
    });
  }

  private getMessage(exception: unknown) {
    if (exception instanceof HttpException) {
      const response = exception.getResponse();

      if (typeof response === "string") {
        return response;
      }

      if (response && typeof response === "object" && "message" in response) {
        const message = (response as { message: string | string[] }).message;
        return Array.isArray(message) ? message.join(", ") : message;
      }
    }

    if (exception instanceof Error && exception.message) {
      return exception.message;
    }

    return "Internal server error";
  }
}
