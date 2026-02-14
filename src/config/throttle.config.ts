import { registerAs } from '@nestjs/config';
import { ThrottleConfig } from './interfaces/config.interface';

export default registerAs(
  'throttle',
  (): ThrottleConfig => ({
    ttl: Number.parseInt(process.env.THROTTLE_TTL || '60', 10) * 1000,
    limit: Number.parseInt(process.env.THROTTLE_LIMIT || '10', 10),
  }),
);
