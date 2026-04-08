import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Keep your existing validation and CORS
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.enableCors(); 

  const port = process.env.PORT || 3001;

  // CHANGE: Added '0.0.0.0' to allow Render to "bind" to the port
  await app.listen(port, '0.0.0.0');
  
  console.log(`🚀 Server is live on port ${port}`);
}
bootstrap();