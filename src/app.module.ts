import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './config/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { BooksModule } from './modules/books/books.module';
import { AuthorsModule } from './modules/authors/authors.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { BorrowsModule } from './modules/borrows/borrows.module';
import { UsersModule } from './modules/users/users.module';
import { FineModule } from './modules/fine/fine.module';
import { FineService } from './modules/fine/fine.service';
import { FineController } from './modules/fine/fine.controller';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { SystemParamsModule } from './system-params/system-params.module';
import { ReceiptsModule } from './receipts/receipts.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    BooksModule,
    AuthorsModule,
    CategoriesModule,
    BorrowsModule,
    UsersModule,
    FineModule,
    DashboardModule,
    SystemParamsModule,
    ReceiptsModule,
  ],
  providers: [FineService],
  controllers: [FineController],
})
export class AppModule { }