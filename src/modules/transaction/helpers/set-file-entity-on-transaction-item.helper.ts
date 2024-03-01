import { InternalServerErrorException } from '@nestjs/common';
import { IItemTransactionWithFile } from '../entities/interfaces/transaction-item.interface';
import { getFileEntity } from 'src/storage-service/utils/get-file-entity.util';

export interface ISetFileEntityOnTransactionItem {
  entity: IItemTransactionWithFile;
  fieldName: string;
  files: Express.Multer.File[];
  isMandatory: boolean;
}
export interface ISetFileEntitiesOnTransactionItems {
  entities: IItemTransactionWithFile[];
  fieldNames: string[];
  files: Express.Multer.File[];
  isMandatory: boolean;
}
export const handleAndSetterFileEntityOnTransactionItem = ({
  entity,
  fieldName,
  files,
  isMandatory,
}: ISetFileEntityOnTransactionItem): void => {
  if (isMandatory && !files.length) {
    throw new InternalServerErrorException(
      `The file is mandatory for the field ${fieldName}`,
    );
  }
  const file = files.find((file) => file.fieldname === fieldName);
  if (file) {
    entity.file = getFileEntity(file);
    entity.file.buffer = file.buffer;
  }
};
export const handleAndSetterFileEntitiesOnTransactionItems = ({
  entities,
  fieldNames,
  files,
  isMandatory,
}: ISetFileEntitiesOnTransactionItems): void => {
  entities.forEach((entity, index) => {
    handleAndSetterFileEntityOnTransactionItem({
      entity,
      fieldName: fieldNames[index],
      files,
      isMandatory,
    });
  });
};
