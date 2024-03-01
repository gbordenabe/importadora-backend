import { ValidationPipe } from '@nestjs/common';
import { ClassTransformOptions } from 'class-transformer';
export const appTransformerOptions: ClassTransformOptions = {
  enableImplicitConversion: true,
};
export const validationPipe = new ValidationPipe({
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true,
  transformOptions: appTransformerOptions,
});
