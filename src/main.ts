import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // This is the "Security Guard" for your data
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,      // Strips away fields that aren't in the DTO
    forbidNonWhitelisted: true, // Throws error if extra fields are sent
    transform: true,      // Automatically transforms payloads to DTO instances
  }));

  await app.listen(3000);
}
bootstrap();