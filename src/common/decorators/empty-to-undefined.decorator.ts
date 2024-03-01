import { Transform } from 'class-transformer';
/**
 * Transforms empty values to undefined ('', null). This is useful for query parameters.
 */
export const EmptyToUndefined = (emptyValues?: any[]) =>
  Transform(({ value }) => {
    const defaultEmptyValues = emptyValues ?? [null, ''];
    if (defaultEmptyValues.includes(value)) {
      return undefined;
    }
    return value;
  });
