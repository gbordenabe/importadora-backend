import {
  ClassConstructor,
  Transform,
  plainToInstance,
} from 'class-transformer';
import { isJSON, validateSync } from 'class-validator';
import { plainToInstanceImplementation } from '../helpers/plant-to-instance-implementation.helper';
export const isFunction = (classOrFunction: any): boolean => {
  try {
    classOrFunction();
    return true;
  } catch (error) {
    return false;
  }
};
export interface ITransformJsonOptions {
  classConstructor?:
    | ClassConstructor<any>
    | ((value: any) => ClassConstructor<any>);
  preValidation: ClassConstructor<any>;
}
export interface IVaidateSubClassOptions {
  classConstructor: ClassConstructor<any>;
  property: string;
  object: any;
}
// const validateSubClass = ({
//   classConstructor,
//   property,
//   object,
// }: IVaidateSubClassOptions) => {
//   const value = object[property];
//   let valueToValidate = value;
//   let valueInstanced: ClassConstructor<any> | ClassConstructor<any>[];
//   if (isJSON(value)) valueToValidate = JSON.parse(value);
//   if (Array.isArray(valueToValidate)) {
//     valueInstanced = valueToValidate.map((i) =>
//       plainToInstanceImplementation(i, classConstructor),
//     );
//   } else {
//     valueInstanced = plainToInstanceImplementation(
//       valueToValidate,
//       classConstructor,
//     );
//   }
// };
export const TransformJson = <T>(
  classConstructor?:
    | ClassConstructor<T>
    | ((value: any) => ClassConstructor<T>),
  number?: number,
) =>
  Transform(({ value }) => {
    console.log({ number });
    if (!isJSON(value)) return value;
    const parsedValue = JSON.parse(value);
    if (!classConstructor) return parsedValue;
    const plainToInstanceImplementation = (plain: any) =>
      plainToInstance(
        isFunction(classConstructor)
          ? (classConstructor as any)(plain)
          : classConstructor,
        plain,
        {
          enableImplicitConversion: true,
          exposeDefaultValues: true,
        },
      );
    if (Array.isArray(parsedValue)) {
      return parsedValue.map((i) => plainToInstanceImplementation(i));
    }
    return plainToInstanceImplementation(parsedValue);
  });
