import { ValidateIf } from 'class-validator';

export function AllowNulls() {
  return ValidateIf((_, value) => value !== null);
}
