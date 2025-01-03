import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { envs } from './envs/envs';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        host: '0.0.0.0',
        port: parseInt(envs.PORT)
      }
    },
  );

  app.useGlobalPipes(new ValidationPipe({
    transform: true, // Habilita la transformación automática de objetos
    transformOptions: {
      enableImplicitConversion: true, // Habilita la conversión implícita de tipos
    },
    // Otras opciones del ValidationPipe
  }));
  await app.listen();
}

bootstrap();
