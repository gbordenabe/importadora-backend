import { ClassConstructor, plainToInstance } from 'class-transformer';
import { appTransformerOptions } from 'src/config/validationPipeToTheApp';

export const plainToInstanceImplementation = <T>(
  plain: any,
  classConstructor: ClassConstructor<T>,
) => plainToInstance(classConstructor, plain, appTransformerOptions);
