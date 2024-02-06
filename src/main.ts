import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { validationPipe } from './config/validationPipeToTheApp';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
export const title_app = 'IMPORTADORA';
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

  app.useGlobalPipes(validationPipe);
  const config = new DocumentBuilder()
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      in: 'headers',
    })
    .setTitle(title_app)
    .setDescription(
      `Credenciales para obtener un jwt </br> {</br>"user_name_or_email": "${process.env.FIRST_USER_USERNAME}",</br>"password": "${process.env.FIRST_USER_PASSWORD}"</br>}`,
    )
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
  await app.listen(process.env.PORT);
  Logger.log(`App running on port ${process.env.PORT}, version: 2.0`);
}
main();
