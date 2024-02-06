import {
  ApiResponseOptions,
  ApiForbiddenResponse,
  ApiUnauthorizedResponse,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { Type } from '@nestjs/common';

export function ApiForbiddenResponseImplementation(
  options?: ApiResponseOptions,
) {
  return ApiForbiddenResponse({
    description: 'Acceso denegado / Access denied',
    ...options,
  });
}

export function ApiUnauthorizedResponseImplementation(
  options?: ApiResponseOptions,
) {
  return ApiUnauthorizedResponse({
    description: 'No autorizado / Unauthorized',
    ...options,
  });
}
export function ApiCreatedResponseImplementation(
  // eslint-disable-next-line @typescript-eslint/ban-types
  type?: string | Function | Type<unknown> | [Function],
  options?: Omit<ApiResponseOptions, 'type'>,
) {
  return ApiCreatedResponse({
    description: 'Guardado correctamente / Saved correctly',
    type,
    ...options,
  });
}
export function ApiBadRequestResponseImplementation(
  options?: ApiResponseOptions,
) {
  return ApiBadRequestResponse({
    description: 'Datos enviados incorrectos / Incorrect data sent',
    ...options,
  });
}
export function ApiOkResponseImplementation(
  {
    type,
    method = 'none',
    options,
  }: {
    // eslint-disable-next-line @typescript-eslint/ban-types
    type?: string | Function | Type<unknown> | [Function];
    method?: 'update' | 'get' | 'delete' | 'none';
    options?: Omit<ApiResponseOptions, 'type'>;
  } = { method: 'none' },
) {
  const methodMessage = {
    update: 'Actualizado correctamente / Updated correctly',
    get: 'Obtenido correctamente / Obtained correctly',
    delete:
      'Eliminado correctamente (estado cambiado a false) / Deleted correctly (status changed to false)',
    none: 'Operación realizada correctamente / Operation performed correctly',
  };
  return ApiOkResponse({
    type,
    description: methodMessage[method],
    ...options,
  });
}
export function ApiNotFoundImplementation(options?: ApiResponseOptions) {
  return ApiNotFoundResponse({
    description: 'Recursos no encontrados / Resources not found',
    ...options,
  });
}
