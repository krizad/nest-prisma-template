import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

export const ApiStandardResponse = () => {
  return applyDecorators(
    ApiResponse({
      status: 200,
      description: 'The request has succeeded',
    }),
    ApiResponse({
      status: 400,
      description: 'Bad Request - Validation failed',
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized - Authentication required',
    }),
    ApiResponse({
      status: 403,
      description: 'Forbidden - Insufficient permissions',
    }),
    ApiResponse({
      status: 404,
      description: 'Not Found - Resource not found',
    }),
    ApiResponse({
      status: 500,
      description: 'Internal Server Error',
    }),
  );
};
