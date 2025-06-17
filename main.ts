import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // allows validation pipe to be used globlly 
  app.useGlobalPipes(new ValidationPipe({
    transform: true
  }))
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
