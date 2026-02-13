import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService
  extends PrismaClient<Prisma.PrismaClientOptions, 'query' | 'warn' | 'error'>
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);
  private readonly slowQueryThreshold: number;

  constructor() {
    // create adapter with your connection string
    const adapter = new PrismaPg({
      connectionString: process.env.DATABASE_URL || '',
    });

    super({
      adapter,
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'event', level: 'error' },
        { emit: 'event', level: 'warn' },
      ],
      transactionOptions: {
        maxWait: 5000,
        timeout: 10000,
        isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted,
      },
    });

    this.slowQueryThreshold = this.resolveSlowQueryThreshold();
    this.registerEventListeners();
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  private resolveSlowQueryThreshold(): number {
    const fallback = 1000;
    const rawValue = process.env.PRISMA_SLOW_QUERY_THRESHOLD_MS;

    if (!rawValue) {
      return fallback;
    }

    const parsed = Number(rawValue);
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
  }

  private registerEventListeners(): void {
    const shouldLogQueries = process.env.PRISMA_QUERY_LOG === 'true';

    this.$on('query', (event) => {
      const duration = event.duration || 0;
      const isSlow = duration > this.slowQueryThreshold;

      if (shouldLogQueries || isSlow) {
        this.logger.debug(`[Query] ${event.query} [Duration: ${duration}ms]`);
      }
    });

    this.$on('error', (event) => {
      this.logger.error(`[Prisma Error] ${event.message}`);
    });

    this.$on('warn', (event) => {
      this.logger.warn(`[Prisma Warning] ${event.message}`);
    });
  }

  /**
   * Clean database - useful for testing
   * Use with caution in production!
   */
  async cleanDatabase() {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Cannot clean database in production!');
    }

    const models = Reflect.ownKeys(this).filter(
      (key) =>
        key !== '_engine' && typeof key === 'string' && !key.startsWith('_'),
    );

    this.logger.warn('🧹 Cleaning database...');

    return Promise.all(
      models.map((modelKey) => {
        const model = this[modelKey as keyof this];
        if (model && typeof model === 'object' && 'deleteMany' in model) {
          return (model as any).deleteMany();
        }
      }),
    );
  }

  /**
   * Health check for the database connection
   */
  async healthCheck(): Promise<boolean> {
    try {
      await this.$queryRaw`SELECT 1`;
      return true;
    } catch (error) {
      this.logger.error('Database health check failed:', error);
      return false;
    }
  }

  /**
   * Execute raw SQL with proper error handling
   */
  async executeRaw(query: string, ...params: any[]) {
    try {
      return await this.$executeRawUnsafe(query, ...params);
    } catch (error) {
      this.logger.error('Raw query execution failed:', error);
      throw error;
    }
  }

  /**
   * Query raw SQL with proper error handling
   */
  async queryRaw<T = any>(query: string, ...params: any[]): Promise<T> {
    try {
      return await this.$queryRawUnsafe(query, ...params);
    } catch (error) {
      this.logger.error('Raw query failed:', error);
      throw error;
    }
  }
}
