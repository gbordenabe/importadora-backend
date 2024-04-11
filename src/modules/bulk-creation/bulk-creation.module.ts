import { Module } from '@nestjs/common';
import { BulkCreationService } from './bulk-creation.service';
import { BulkCreationController } from './bulk-creation.controller';
import { ClientModule } from '../client/client.module';

@Module({
  imports: [ClientModule],
  controllers: [BulkCreationController],
  providers: [BulkCreationService],
})
export class BulkCreationModule {}
