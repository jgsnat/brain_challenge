import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { swaggerConfig } from './config/swagger.config';
import { SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const swagger = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('swagger', app, swagger);
  await app.listen(3000);
}

bootstrap();
