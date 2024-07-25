/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './swagger';
import * as cookieParser from 'cookie-parser';
import * as dotenv from 'dotenv';
import { Logger } from '@nestjs/common';

dotenv.config();

async function bootstrap() {
  const blPort = process.env.BL_API_PORT || 8080;
  const authPort = process.env.AUTH_API_PORT || 18080;
  const swaggerPort = process.env.SWAGGER_PORT || 8081;

  try {
    const app = await NestFactory.create(AppModule, { cors: true });
    app.use(cookieParser());
    app.enableCors();
    await app.listen(blPort, () => {
      const addressBL = `http://localhost:${blPort}`;
      Logger.log(`API server is running on ${addressBL}`);
    });

  
    const authApp = await NestFactory.create(AppModule, { cors: true });
    authApp.use(cookieParser());
    authApp.enableCors();
    await authApp.listen(authPort, () => {
      const authAddress = `http://localhost:${authPort}`;
      Logger.log(`Auth server is running on ${authAddress}`);
    });

   
    const swaggerApp = await NestFactory.create(AppModule, { cors: true });
    swaggerApp.use(cookieParser());
    swaggerApp.enableCors();
    setupSwagger(swaggerApp);
    await swaggerApp.listen(swaggerPort, () => {
      const addressSwagger = `http://localhost:${swaggerPort}`;
      Logger.log(`Swagger server is running on ${addressSwagger}`);
      Logger.log(`Swagger is available on ${addressSwagger}/api/docs`);
    });
  } catch (err) {
    Logger.error('Error starting server:', err);
    process.exit(1);
  }
}

bootstrap();
