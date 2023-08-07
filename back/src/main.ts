import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: true, // Esto permitirá cualquier origen, pero puedes especificar el tuyo si lo prefieres.
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type',
    credentials: true,
    optionsSuccessStatus: 204,
    preflightContinue: false,
  });
  await app.listen(4000);
}
bootstrap();
