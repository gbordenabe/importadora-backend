import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { BulkCreationService } from './bulk-creation.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('bulk-creation')
export class BulkCreationController {
  constructor(private readonly bulkCreationService: BulkCreationService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  createClientsFromCsv(@UploadedFile() file: Express.Multer.File) {
    return this.bulkCreationService.createClientsFromCsv(file);
  }
}
