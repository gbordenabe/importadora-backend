import { FindOptionsRelations } from 'typeorm';

export interface IFindOneByIdOptions {
  id: number;
  relations?: boolean;
}
export interface IFindAndCountResult<Entity> {
  data: Entity[];
  count: number;
}
// tipo clase instanciable
export interface IServiceInterface<Entity, CreateEntityDto, UpdateEntityDto> {
  entityName: string;
  relations: FindOptionsRelations<Entity>;
  findAll(...args: any[]): Promise<IFindAndCountResult<Entity>>;
  findOneById(options: IFindOneByIdOptions, ...args: any[]): Promise<Entity>;
  create(dto: CreateEntityDto, ...args: any[]): Promise<Entity>;
  updateOneById(
    id: number,
    dto: UpdateEntityDto,
    ...args: any[]
  ): Promise<Entity>;
  removeOneById(id: number): Promise<void>;
  getAndVerifyDto(
    dto: Partial<CreateEntityDto & UpdateEntityDto>,
    ...args: any[]
  ): Promise<Entity>;
}
