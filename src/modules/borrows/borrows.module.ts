import { Module } from '@nestjs/common';
import { BorrowService } from './borrows.service';
import { BorrowController } from './borrows.controller';

@Module({
  providers: [BorrowService],
  controllers: [BorrowController]
})
export class BorrowsModule { }
