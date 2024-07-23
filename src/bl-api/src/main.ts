/* eslint-disable prettier/prettier */

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './swagger';
import * as cookieParser from 'cookie-parser';
import * as dotenv from 'dotenv';
import { Logger } from '@nestjs/common';

dotenv.config();

async function bootstrap() {
  const apiPort = process.env.BL_API_PORT || 8080;
  const swaggerPort = process.env.SWAGGER_PORT || 8081;

  try {
    // Start the main API server
    const app = await NestFactory.create(AppModule, { cors: true });
    app.use(cookieParser());
    app.enableCors();
    setupSwagger(app);
    await app.listen(apiPort, () => {
      const address = `http://localhost:${apiPort}`;
      Logger.log(`API server is running on ${address}`);
      Logger.log(`Swagger is available on ${address}/api/docs`);
    });
  } catch (err) {
    Logger.error('Error starting server:', err);
    process.exit(1);
  }
}

bootstrap();
