import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import type { Request, Response as ExpressRes } from 'express';

type ErrorBody = {
  message?: string | string[];
  errors?: unknown;
  code?: string;
  data?: unknown;
  details?: unknown;
};

@Catch()
export class UnifiedErrorFilter implements ExceptionFilter {
  private readonly logger = new Logger(UnifiedErrorFilter.name);

  catch(err: unknown, host: ArgumentsHost) {
    const http = host.switchToHttp();
    const req = http.getRequest<Request>();
    const res = http.getResponse<ExpressRes>();

    const normalized = this.normalizeError(err);
    const payload = this.buildPayload(req, normalized);
    this.logError(req, err, normalized.message);

    // --- Express detection ---
    if (typeof res?.status === 'function' && typeof res?.json === 'function') {
      res.setHeader?.('Content-Type', 'application/json');
      return res.status(normalized.status).json(payload);
    }

    // --- Last resort (very rare) ---
    try {
      res.statusCode = normalized.status;
      return res.send ? res.send(payload) : res.end?.(JSON.stringify(payload));
    } catch {
      return payload;
    }
  }

  private normalizeError(err: unknown) {
    if (err instanceof HttpException) {
      const body = err.getResponse();
      const parsedBody = this.asErrorBody(body);
      const message =
        typeof parsedBody?.message === 'string'
          ? parsedBody.message
          : err.message;
      const details = this.extractDetailsFromBody(parsedBody);
      const code =
        typeof parsedBody?.code === 'string' ? parsedBody.code : undefined;
      const data = parsedBody?.data;
      return {
        status: err.getStatus(),
        message: message || 'Unexpected error',
        code,
        details,
        data,
      };
    }

    // Handle Prisma Known Request Errors
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: this.handlePrismaError(err),
        code: err.code,
        details: undefined,
        data: undefined,
      };
    }

    // Handle Prisma Validation Errors
    if (err instanceof Prisma.PrismaClientValidationError) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'Validation error in database query',
        code: undefined,
        details: undefined,
        data: undefined,
      };
    }

    if (err instanceof Error) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: err.message || 'Unexpected error',
        code: undefined,
        details: undefined,
        data: undefined,
      };
    }

    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Unexpected error',
      code: undefined,
      details: undefined,
      data: undefined,
    };
  }

  private handlePrismaError(
    exception: Prisma.PrismaClientKnownRequestError,
  ): string {
    switch (exception.code) {
      case 'P2002':
        return `Unique constraint failed on ${(exception.meta?.target as string[])?.join(', ') ?? 'unknown field'}`;
      case 'P2025':
        return 'Record not found';
      case 'P2003':
        return 'Foreign key constraint failed';
      case 'P2014':
        return 'Invalid ID';
      default:
        return 'Database operation failed';
    }
  }

  private asErrorBody(body: unknown): ErrorBody | undefined {
    if (typeof body === 'object' && body !== null) {
      return body as ErrorBody;
    }
    return undefined;
  }

  private extractDetailsFromBody(body: ErrorBody | undefined) {
    if (Array.isArray(body?.message)) return body.message;
    if (body?.errors) return body.errors;
    if (body?.details) return body.details;
    return undefined;
  }

  private buildPayload(
    req: Request,
    normalized: {
      status: number;
      message: string;
      code?: string;
      details?: unknown;
      data?: unknown;
    },
  ) {
    return {
      success: false as const,
      error: {
        message: normalized.message,
        code: normalized.code,
        type: `HTTP_${normalized.status}`,
        details: normalized.details,
        data: normalized.data,
      },
      context: {
        requestId: String(req?.headers?.['x-request-id'] ?? ''),
        path: req?.originalUrl ?? req?.url ?? '',
        method: req?.method ?? '',
        status: normalized.status,
        ts: new Date().toISOString(),
      },
    };
  }

  private logError(req: Request, err: unknown, message: string) {
    const logPath = req?.originalUrl ?? req?.url ?? '';
    const logMethod = req?.method ?? '';
    if (err instanceof Error) {
      this.logger.error(`${logMethod} ${logPath} -> ${message}`, err.stack);
      return;
    }
    this.logger.error(
      `${logMethod} ${logPath} -> ${message}`,
      typeof err === 'string' ? err : JSON.stringify(err),
    );
  }
}
