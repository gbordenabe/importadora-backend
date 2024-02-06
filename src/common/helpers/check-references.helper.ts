import { IServiceInterface } from '../interfaces/service.interface';
export declare type ServiceWithDtoVerification<Entity, Dto> = Omit<
  IServiceInterface<Entity, Dto, Dto>,
  'create' | 'findOneById' | 'updateOneById' | 'removeOneById' | 'findAll'
>;
export interface ICheckFkOptions<T> {
  service: IServiceInterface<T, any, any>;
  fkId: number;
}
export interface ICheckDtoOptions<Entity, Dto> {
  service: ServiceWithDtoVerification<Entity, Dto>;
  dto: Dto;
}
export interface ICheckDtosOptions<Entity, Dto> {
  service: ServiceWithDtoVerification<Entity, Dto>;
  dtos: Dto[];
}
export const checkFk = async <T>({ service, fkId }: ICheckFkOptions<T>) => {
  return fkId
    ? await service.findOneById({ id: fkId, relations: false })
    : undefined;
};
export const checkDto = async <Entity, Dto>({
  service,
  dto,
}: ICheckDtoOptions<Entity, Dto>) => {
  return dto ? await service.getAndVerifyDto(dto) : undefined;
};
export const checkDtos = async <Entity, Dto>({
  service,
  dtos,
}: ICheckDtosOptions<Entity, Dto>) => {
  return dtos?.length
    ? await Promise.all(
        dtos.map(async (dto) => await service.getAndVerifyDto(dto)),
      )
    : undefined;
};
