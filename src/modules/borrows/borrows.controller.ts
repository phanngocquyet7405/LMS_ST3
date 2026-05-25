import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    ParseIntPipe,
    Patch,
    UseGuards,
} from '@nestjs/common';
import { BorrowService } from './borrows.service';
import { CreateBorrowDto } from './dto/create-borrow.dto';

import { JwtAuthGuard } from '../../common/guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles/roles.guard';
import { Roles } from '../../common/decorators/roles.decorators';

@Controller('borrows')
@UseGuards(JwtAuthGuard)
export class BorrowController {
    constructor(private readonly borrowService: BorrowService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    create(@Body() dto: CreateBorrowDto) {
        return this.borrowService.create(dto);
    }

    @Get()
    @UseGuards(RolesGuard)
    @Roles('ADMIN', 'LIBRARIAN')
    findAll() {
        return this.borrowService.findAll();
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.borrowService.findOne(id);
    }

    // borrows.controller.ts

    @Patch('overdue/check')   // ← tĩnh lên trước
    @UseGuards(RolesGuard)
    @Roles('ADMIN', 'LIBRARIAN')
    checkOverdue() {
        return this.borrowService.checkOverdue();
    }

    @Patch(':id/return')      // ← động xuống sau
    returnBorrow(@Param('id', ParseIntPipe) id: number) {
        return this.borrowService.returnBorrow(id);
    }
}