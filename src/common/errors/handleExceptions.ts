import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
//errores devueltos por la DB
export const handleExceptions = (error: any, nameEntity: string): never => {
  if (error.code === '23505')
    throw new ConflictException( //409
      `El registro de tipo '${nameEntity}' ya existe en la Base de Datos ${JSON.stringify(
        error.detail,
      )}`,
    );

  console.log(error);
  throw new InternalServerErrorException(
    `No se pudo crear o actualizar la entidad de tipo "${nameEntity}" - Check logs`,
  );
};
