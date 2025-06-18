import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // allows validation pipe to be used globlly 
  app.useGlobalPipes(new ValidationPipe({
          whitelist: true,               // Strip properties that are not in the DTO
      forbidNonWhitelisted: true,    // Throw error if extra properties are passed
      transform: true,               
  }))
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
