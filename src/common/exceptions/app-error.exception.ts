import { HttpException, HttpStatus } from '@nestjs/common';

export class AppErrorException extends HttpException {
  constructor(
    message: string,
    code: string,
    status: HttpStatus = HttpStatus.BAD_REQUEST,
    details?: any,
    data?: any,
  ) {
    if (
      status === HttpStatus.UNSUPPORTED_MEDIA_TYPE ||
      status === HttpStatus.UNPROCESSABLE_ENTITY
    ) {
      super({ message, code, details, data }, status);
    } else {
      super({ message, code, details }, status);
    }
  }
}
