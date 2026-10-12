import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const rawPort = process.env.PORT || configService.get<string | number>('PORT', 4000);
  const port = typeof rawPort === 'string' ? parseInt(rawPort, 10) : Number(rawPort);

  // Global prefix: /api/v1
  app.setGlobalPrefix('api/v1');

  // Normalize incoming URLs (collapse duplicate slashes like //auth/login and prepend /api/v1 if omitted)
  app.use((req: any, _res: any, next: any) => {
    if (req.url) {
      let cleanUrl = req.url.replace(/\/+/g, '/');
      const pathname = cleanUrl.split('?')[0];
      const query = cleanUrl.includes('?') ? `?${cleanUrl.split('?').slice(1).join('?')}` : '';

      if (
        !pathname.startsWith('/api') &&
        !pathname.startsWith('/health') &&
        !pathname.startsWith('/favicon.ico')
      ) {
        cleanUrl = `/api/v1${pathname.startsWith('/') ? pathname : `/${pathname}`}${query}`;
      } else {
        cleanUrl = `${pathname}${query}`;
      }
      req.url = cleanUrl;
    }
    next();
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Global filters and interceptors
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new LoggingInterceptor());

  // Enable CORS (supports localhost, configured APP_URL, custom CORS_ORIGINS, and Vercel preview/production domains)
  const configuredAppUrl = configService.get<string>('APP_URL');
  const allowedOrigins: (string | RegExp)[] = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    /\.vercel\.app$/,
  ];
  if (configuredAppUrl) {
    allowedOrigins.push(configuredAppUrl);
  }
  const extraOrigins = configService.get<string>('CORS_ORIGINS');
  if (extraOrigins) {
    extraOrigins
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
      .forEach((origin) => allowedOrigins.push(origin));
  }

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  });

  // Swagger OpenAPI documentation
  const config = new DocumentBuilder()
    .setTitle('ExamSathi Nepal (GyanDwar) API')
    .setDescription(
      'REST API documentation for Nepal Engineering Council (NEC), Lok Sewa, and Diploma examination preparation platform.',
    )
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(port, '0.0.0.0');
  logger.log(`🚀 ExamSathi Nepal API running on: http://0.0.0.0:${port}/api/v1`);
  logger.log(`📖 Swagger OpenAPI documentation: http://0.0.0.0:${port}/api/docs`);
}

bootstrap();
