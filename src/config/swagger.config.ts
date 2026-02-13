import { registerAs } from '@nestjs/config';
import { SwaggerConfig } from './interfaces/config.interface';

export default registerAs(
  'swagger',
  (): SwaggerConfig => ({
    enabled: process.env.SWAGGER_ENABLED === 'true',
    path: process.env.SWAGGER_PATH || 'api-docs',
  }),
);
