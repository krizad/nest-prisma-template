export interface AppConfig {
  port: number;
  apiPrefix: string;
  nodeEnv: string;
  corsOrigins: string[];
}

export interface DatabaseConfig {
  url: string;
}

export interface JwtConfig {
  enabled: boolean;
  secret: string;
  expiresIn: string;
  refreshSecret: string;
  refreshExpiresIn: string;
}

export interface SwaggerConfig {
  enabled: boolean;
  path: string;
}

export interface ThrottleConfig {
  ttl: number;
  limit: number;
}
