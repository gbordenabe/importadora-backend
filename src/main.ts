import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';


async function main() {
  const app = await NestFactory.create(AppModule);
  // app.setGlobalPrefix('api');
  // Configurar CORS
  app.enableCors({
    origin: '*', // Reemplaza con tu URL permitida
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    allowedHeaders: 'Origin,X-Requested-With,Content-Type,Accept,Authorization',
  });

  app.useGlobalPipes(
    new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    })
   );


   await app.listen(process.env.PORT);
   Logger.log(`App running on port ${ process.env.PORT }`);
}
main();