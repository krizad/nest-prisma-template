import { registerAs } from '@nestjs/config';
import { JwtConfig } from './interfaces/config.interface';

export default registerAs(
  'jwt',
  (): JwtConfig => ({
    enabled: process.env.JWT_ENABLED !== 'false',
    secret: process.env.JWT_SECRET || 'default-secret-change-in-production',
    expiresIn: process.env.JWT_EXPIRATION || '7d',
    refreshSecret:
      process.env.JWT_REFRESH_SECRET ||
      'default-refresh-secret-change-in-production',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRATION || '30d',
  }),
);
