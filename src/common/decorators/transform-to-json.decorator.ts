import {
  ClassConstructor,
  Transform,
  plainToInstance,
} from 'class-transformer';
import { isJSON } from 'class-validator';
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

export const TransformJson = <T>(
  classConstructor?:
    | ClassConstructor<T>
    | ((value: any) => ClassConstructor<T>),
) =>
  Transform(({ value }) => {
    let valueToReturn = value;
    if (isJSON(value)) valueToReturn = JSON.parse(value);
    if (!classConstructor) return valueToReturn;
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
    return plainToInstanceImplementation(valueToReturn);
  });
export const TransformJson2 = () => {
  return Transform(({ value }) => {
    if (!isJSON(value)) return value;
    const parsedValue = JSON.parse(value);
    return parsedValue;
  });
};
