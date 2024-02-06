import { isBooleanString } from 'class-validator';
import BooleanString from '../interfaces/boolean-string.interface';
/**
 * Returna un booleano de acuerdo a si el string es 'true', 'false', '1', o '0'.
 * Si el valor enviado no es ninguno de los anteriores devuelve undefined
 */
export const convertOptionalBooleanString = (
  value: BooleanString | undefined,
): boolean | undefined => {
  return isBooleanString(value)
    ? ['1', 'true'].includes(value.toString())
    : undefined;
};
