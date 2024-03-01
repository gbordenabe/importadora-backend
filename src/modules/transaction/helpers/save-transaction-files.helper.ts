import { StorageService } from 'src/storage-service/storage.service';
import { Transaction } from '../entities/transaction.entity';
import { IItemTransactionWithFile } from '../entities/interfaces/transaction-item.interface';
export const saveFilesOfTransactionItems = async (
  items: IItemTransactionWithFile[],
  storageService: StorageService,
) => {
  // items
  //   ?.filter((item) => item.file)
  //   .forEach((item) => {
  //     storageService.uploadFile({
  //       name: item.file.file_name,
  //       file: { buffer: item.file.buffer } as any,
  //     });
  //     delete item.file.buffer;
  //   });
  const promises =
    items
      ?.filter((item) => item.file)
      ?.map(async (item) => {
        return await storageService.uploadFile({
          name: item.file.file_name,
          file: { buffer: item.file.buffer } as any,
        });
      }) ?? [];
  await Promise.all(promises);
};
export const saveTransactionFiles = (
  transaction: Transaction,
  storageService: StorageService,
) => {
  saveFilesOfTransactionItems(transaction.checks, storageService);
  saveFilesOfTransactionItems(transaction.cash, storageService);
  saveFilesOfTransactionItems(transaction.deposits, storageService);
  saveFilesOfTransactionItems(transaction.retentions, storageService);
};
