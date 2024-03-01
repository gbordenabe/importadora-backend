import { Injectable, OnModuleInit } from '@nestjs/common';
import { UploadData } from './interface/upload-data.interface';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
@Injectable()
export class StorageService implements OnModuleInit {
  private readonly uploadPath: string = process.env.UPLOADS_FOLDER;
  private s3Client: S3Client;
  private readonly bucketName: string = process.env.AWS_BUCKET_NAME;
  constructor() {}
  onModuleInit() {
    this.s3Client = new S3Client({
      region: process.env.AWS_BUCKET_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
  }
  // uploadFile(data: UploadData) {
  //   const fileName = data.name ?? data.file.originalname;
  //   fs.writeFileSync(`${this.uploadPath}/${fileName}`, data.file.buffer);
  // }
  async uploadFile(data: UploadData) {
    const fileName = data.name ?? data.file.originalname;
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: fileName,
      Body: data.file.buffer,
    });
    await this.s3Client.send(command);
  }
  async uploadFiles(fileInfos: UploadData[]) {
    const promises = fileInfos.map((fileInfo) => this.uploadFile(fileInfo));
    await Promise.all(promises);
  }
  // readBuffer(filename: string) {
  //   return fs.readFileSync(`${this.uploadPath}/${filename}`);
  // }
  async readBuffer(filename: string) {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: filename,
    });
    const result = await this.s3Client.send(command);
    return result.Body.transformToByteArray();
  }
  // deleteFile(filename: string) {
  //   if (!fs.existsSync(`${this.uploadPath}/${filename}`)) return;
  //   fs.unlinkSync(`${this.uploadPath}/${filename}`);
  // }
  async deleteFile(filename: string) {
    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: filename,
    });
    await this.s3Client.send(command);
  }
  async replaceFile(data: UploadData, oldFileName: string) {
    await this.uploadFile(data);
    await this.deleteFile(oldFileName);
  }
}
