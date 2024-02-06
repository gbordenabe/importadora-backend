import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { Bill } from './entities/bill.entity';
import { TransactionController } from './controllers/transaction.controller';
import { BillController } from './controllers/bill.controller';
import { TransactionService } from './services/transaction.service';
import { CheckService } from './services/check.service';
import { BillService } from './services/bill.service';
import { CompanyModule } from '../company/company.module';
import { ClientModule } from '../client/client.module';
import { AuthModule } from 'src/auth/auth.module';
import { CashService } from './services/cash.service';
import { CreditNoteService } from './services/credit-note.service';
import { CreditService } from './services/credit.service';
import { DepositService } from './services/deposit.service';
import { RetentionService } from './services/retention.service';
import { Cash } from './entities/cash.entity';
import { Check } from './entities/check.entity';
import { CreditNote } from './entities/credit-note.entity';
import { Credit } from './entities/credit.entity';
import { Deposit } from './entities/deposit.entity';
import { Retention } from './entities/retention.entity';
import { CashController } from './controllers/cash.controller';
import { CheckController } from './controllers/check.controller';
import { CreditNoteController } from './controllers/credit-note.controller';
import { CreditController } from './controllers/credit.controller';
import { DepositController } from './controllers/deposit.controller';
import { RetentionController } from './controllers/retention.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Transaction,
      Bill,
      Cash,
      Check,
      CreditNote,
      Credit,
      Deposit,
      Retention,
    ]),
    CompanyModule,
    ClientModule,
    AuthModule,
  ],
  controllers: [
    TransactionController,
    BillController,
    CashController,
    CheckController,
    CreditNoteController,
    CreditController,
    DepositController,
    RetentionController,
  ],
  providers: [
    TransactionService,
    CheckService,
    BillService,
    CashService,
    CheckService,
    CreditNoteService,
    CreditService,
    DepositService,
    RetentionService,
  ],
})
export class TransactionModule {}
