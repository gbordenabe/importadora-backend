import { ValueTransformer } from 'typeorm';

export const numericOrNullTransformer: ValueTransformer = {
  to: (value: number | null): string | null => value?.toString() ?? null,
  from: (value: string | null): number | null =>
    value ? parseFloat(value) : null,
};

export const numericTransformer: ValueTransformer = {
  from: (value: string) => parseFloat(value),
  to: (value: number) => value.toString(),
};
