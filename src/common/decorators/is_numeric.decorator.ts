import { registerDecorator, isNumber, IsNumberOptions } from 'class-validator';
export interface IsNumericOptions extends IsNumberOptions {
  precision?: number;
}
export function IsNumeric(validationOptions?: IsNumericOptions) {
  return function (object: object, propertyName: string) {
    const precisionMsg =
      validationOptions?.precision !== undefined
        ? `a maximun precision of ${validationOptions.precision}`
        : undefined;
    const scaleMsg =
      validationOptions?.maxDecimalPlaces !== undefined
        ? `a maximun scale of ${validationOptions.maxDecimalPlaces}`
        : undefined;
    const msgList = [precisionMsg, scaleMsg];
    let message = `${propertyName} should be a number `;
    if (validationOptions?.maxDecimalPlaces || validationOptions?.precision)
      message += `and shoud have: ${msgList.filter((e) => e).join(', ')}`;
    registerDecorator({
      name: 'isNumeric',
      target: object.constructor,
      propertyName: propertyName,
      options: {
        message,
        ...validationOptions,
      },
      validator: {
        validate(value: any) {
          return (
            isNumber(value, validationOptions) &&
            (!validationOptions.precision ||
              value.toString().replace('.', '').length <=
                validationOptions.precision)
          );
        },
      },
    });
  };
}
