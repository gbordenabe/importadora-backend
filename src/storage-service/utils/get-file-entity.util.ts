import { File } from 'src/storage-service/entities/file.entity';

export function getFileEntity(file: Express.Multer.File) {
  if (!file) {
    return null;
  }
  return {
    file_name: (
      file.originalname.split('.')[0] +
      '-' +
      new Date().getTime().toString()
    ).concat(
      file.originalname.split('.')[1]
        ? '.' + file.originalname.split('.')[1]
        : '',
    ),
    type: file.mimetype,
    size: file.size.toString(),
  } as File;
}
