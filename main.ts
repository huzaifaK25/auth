import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/modules/app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // allows validation pipe to be used globlly
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip properties that are not in the DTO
      forbidNonWhitelisted: true, // Throw error if extra properties are passed
      transform: true,
    }),
  );

  // to enable CORS (Cross Origin)(API calls from front end)
  app.enableCors({
    origin: 'http://localhost:3001',
    credentials: true,
  });

  // swagger API documentation builder options
  const options = new DocumentBuilder()
    .setTitle('Authentication')
    .setDescription('Authentication API description')
    .setVersion('1.0')
    .addTag('auth')
    .addBearerAuth()
    .build();
  // swagget setup
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
