import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  StreamableFile,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, map } from 'rxjs';
import type { Request, Response } from 'express';
import { SKIP_WRAP_KEY } from '../decorators/skip-warp.decorator';
import { PaginationMetaDto } from '../model/response/response-base.dto';
import { PaginatedHeaders } from '../types/pagination';

const isStream = (d: unknown): d is StreamableFile =>
  d instanceof StreamableFile ||
  (typeof d === 'object' &&
    d !== null &&
    typeof (d as { pipe?: unknown }).pipe === 'function');

@Injectable()
export class ApiResponseInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}

  intercept(ctx: ExecutionContext, next: CallHandler): Observable<unknown> {
    const http = ctx.switchToHttp();
    const req = http.getRequest<Request>();
    const res = http.getResponse<Response>();
    const skip = this.reflector.getAllAndOverride<boolean>(SKIP_WRAP_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);

    return next.handle().pipe(
      map((payload: unknown) => {
        if (skip) return payload;
        if (res.statusCode === 204) return undefined;
        if (isStream(payload)) return payload;

        const ct = String(res.getHeader('content-type') || '');
        if (ct && !/json|problem\+json/i.test(ct)) return payload;

        if (this.isPagedPayload(payload)) {
          const parseQueryNumber = (val: unknown, fallback: number): number => {
            if (typeof val === 'string') return Number.parseInt(val, 10);
            if (typeof val === 'number') return val;
            if (Array.isArray(val) && typeof val[0] === 'string') {
              return Number.parseInt(val[0], 10);
            }
            return fallback;
          };

          // Support both query params and POST body
          const rawPage =
            req.query.page ??
            (req.body as Record<string, unknown> | undefined)?.page;
          const pageNum = parseQueryNumber(rawPage, 1);

          const rawSize =
            req.query.size ??
            (req.body as Record<string, unknown> | undefined)?.size;
          const sizeNum = parseQueryNumber(rawSize, 20);

          const page = Math.max(1, Number.isNaN(pageNum) ? 1 : pageNum);
          const size = Math.min(
            100,
            Math.max(1, Number.isNaN(sizeNum) ? 20 : sizeNum),
          );
          const pageCount = Math.max(1, Math.ceil(payload.total / size));

          const headers = payload.headers ?? undefined;

          return this.wrap(req, res, payload.items, {
            mode: 'page',
            page,
            size,
            total: payload.total,
            pageCount,
            hasPrev: page > 1,
            hasNext: page < pageCount,
            headers,
          });
        }

        return this.wrap(req, res, payload);
      }),
    );
  }

  private isPagedPayload(payload: unknown): payload is {
    items: unknown;
    total: number;
    headers?: PaginatedHeaders[];
  } {
    if (typeof payload !== 'object' || payload === null) return false;
    const rec = payload as Record<string, unknown>;
    return 'items' in rec && typeof rec.total === 'number';
  }

  private wrap<T = unknown>(
    req: Request,
    res: Response,
    data: T,
    meta?: PaginationMetaDto,
  ): {
    success: true;
    data: T;
    meta: PaginationMetaDto | null;
    context: {
      requestId: string;
      path: string;
      method: string;
      status: number;
      timestamp: string;
    };
  } {
    return {
      success: true as const,
      data,
      meta: meta ?? null,
      context: {
        requestId: String(req.headers['x-request-id'] ?? ''),
        path: req.originalUrl,
        method: req.method,
        status: res.statusCode,
        timestamp: new Date().toISOString(),
      },
    };
  }
}
