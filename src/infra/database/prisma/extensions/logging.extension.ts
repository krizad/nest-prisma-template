import { Prisma } from '@prisma/client';
import { Logger } from '@nestjs/common';

const logger = new Logger('PrismaLogging');

/**
 * Logging extension for Prisma
 * Logs all database operations with performance metrics
 */
export const loggingExtension = (
  enableSlowQueryLog = true,
  slowQueryThresholdMs = 1000,
) =>
  Prisma.defineExtension({
    name: 'logging',
    query: {
      $allModels: {
        async $allOperations({ operation, model, args, query }) {
          const start = Date.now();

          try {
            const result = await query(args);
            const duration = Date.now() - start;

            // Log slow queries
            if (enableSlowQueryLog && duration > slowQueryThresholdMs) {
              logger.warn(
                `🐌 Slow Query Detected: ${model}.${operation} took ${duration}ms`,
              );
            }

            // Debug logging in development
            if (process.env.NODE_ENV === 'development') {
              logger.debug(
                `✅ ${model}.${operation} completed in ${duration}ms`,
              );
            }

            return result;
          } catch (error) {
            const duration = Date.now() - start;
            logger.error(
              `❌ ${model}.${operation} failed after ${duration}ms:`,
              error,
            );
            throw error;
          }
        },
      },
    },
  });

/**
 * Performance monitoring extension
 * Tracks query performance and collects metrics
 */
export interface QueryMetrics {
  operation: string;
  model: string;
  duration: number;
  timestamp: Date;
  success: boolean;
}

const metricsStore: QueryMetrics[] = [];

export const performanceExtension = Prisma.defineExtension({
  name: 'performance',
  query: {
    $allModels: {
      async $allOperations({ operation, model, args, query }) {
        const start = Date.now();
        let success = true;

        try {
          const result = await query(args);
          return result;
        } catch (error) {
          success = false;
          throw error;
        } finally {
          const duration = Date.now() - start;

          // Store metrics (you might want to send these to a monitoring service)
          metricsStore.push({
            operation,
            model,
            duration,
            timestamp: new Date(),
            success,
          });

          // Keep only last 1000 metrics to prevent memory leaks
          if (metricsStore.length > 1000) {
            metricsStore.shift();
          }
        }
      },
    },
  },
});

/**
 * Get collected metrics
 */
export const getMetrics = (): QueryMetrics[] => [...metricsStore];

/**
 * Clear metrics
 */
export const clearMetrics = (): void => {
  metricsStore.length = 0;
};

/**
 * Get average query time by model and operation
 */
export const getAverageQueryTime = (
  model?: string,
  operation?: string,
): number => {
  const filtered = metricsStore.filter(
    (m) =>
      (!model || m.model === model) &&
      (!operation || m.operation === operation) &&
      m.success,
  );

  if (filtered.length === 0) return 0;

  const total = filtered.reduce((sum, m) => sum + m.duration, 0);
  return total / filtered.length;
};
