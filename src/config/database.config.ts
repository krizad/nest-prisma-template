import { registerAs } from '@nestjs/config';
import { DatabaseConfig } from './interfaces/config.interface';

export default registerAs(
  'database',
  (): DatabaseConfig => ({
    url: process.env.DATABASE_URL || '',
  }),
);
