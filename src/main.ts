import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { UnifiedErrorFilter } from './common/filters';
import helmet from 'helmet';
import compression from 'compression';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  // Security
  app.use(helmet());
  app.use(compression());

  // Graceful shutdown hooks
  app.enableShutdownHooks();

  const configService = app.get(ConfigService);
  const logger = new Logger('Bootstrap');

  // Global prefix
  const apiPrefix =
    (configService.get<string>('app.apiPrefix') as string) || 'api';
  app.setGlobalPrefix(apiPrefix);

  // Enable versioning
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // CORS
  const corsOrigins = configService.get<string[]>('app.corsOrigins');
  app.enableCors({
    origin: corsOrigins,
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Global exception filter
  app.useGlobalFilters(new UnifiedErrorFilter());

  // Global interceptors (ApiResponseInterceptor and LoggingInterceptor are registered in AppModule)

  // Swagger configuration
  const swaggerEnabled =
    (configService.get<boolean>('swagger.enabled') as boolean) ?? true;
  const swaggerPath =
    (configService.get<string>('swagger.path') as string) || 'api/docs';

  if (swaggerEnabled) {
    const config = new DocumentBuilder()
      .setTitle('NestJS Prisma API')
      .setDescription(
        'Production-ready NestJS + Prisma boilerplate with Clean Architecture and DDD',
      )
      .setVersion('1.0')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'JWT',
          description: 'Enter JWT token',
          in: 'header',
        },
        'JWT-auth',
      )
      .addTag('Health', 'Health check endpoints')
      .addTag('Users', 'User management endpoints')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(swaggerPath, app, document, {
      swaggerOptions: {
        persistAuthorization: true,
      },
    });

    logger.log(`Swagger documentation available at: /${swaggerPath}`);
  }

  // Start server
  const port = (configService.get<number>('app.port') as number) || 3000;
  const nodeEnv =
    (configService.get<string>('app.nodeEnv') as string) || 'development';

  const databaseUrl =
    (configService.get<string>('database.url') as string) || '';
  const maskedDatabaseUrl = databaseUrl
    ? databaseUrl.replace(/(\/\/[^:/?#]+):[^@/]+@/i, '$1:***@')
    : '(not set)';

  await app.listen(port);

  logger.log(
    `🚀 Application is running on: http://localhost:${port}/${apiPrefix}`,
  );
  logger.log(`🌍 Environment: ${nodeEnv}`);
  logger.log(`📚 Swagger URL: http://localhost:${port}/${swaggerPath}`);
  logger.log(`🗄️  Connected DB URL: ${maskedDatabaseUrl}`);

}

void bootstrap();
