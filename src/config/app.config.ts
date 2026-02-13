import { registerAs } from '@nestjs/config';
import { AppConfig } from './interfaces/config.interface';

export default registerAs(
  'app',
  (): AppConfig => ({
    port: Number.parseInt(process.env.PORT || '3000', 10),
    apiPrefix: process.env.API_PREFIX || 'api/v1',
    nodeEnv: process.env.NODE_ENV || 'development',
    corsOrigins: process.env.CORS_ORIGINS?.split(',') || [
      'http://localhost:3000',
    ],
  }),
);
