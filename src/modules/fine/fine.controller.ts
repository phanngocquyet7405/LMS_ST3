import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    ParseIntPipe,
    UseGuards,
} from '@nestjs/common';
import { FineService } from './fine.service';
import { CreateFineDto } from './dto/create-fine.dto';
import { UpdateFineDto } from './dto/update-fine.dto';

import { JwtAuthGuard } from '../../common/guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles/roles.guard';
import { Roles } from '../../common/decorators/roles.decorators';

@Controller('fines')
@UseGuards(JwtAuthGuard)
export class FineController {
    constructor(private readonly fineService: FineService) { }

    @Post()
    @UseGuards(RolesGuard)
    @Roles('ADMIN', 'LIBRARIAN')
    create(@Body() dto: CreateFineDto) {
        return this.fineService.create(dto);
    }

    @Get()
    @UseGuards(RolesGuard)
    @Roles('ADMIN', 'LIBRARIAN')
    findAll() {
        return this.fineService.findAll();
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.fineService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(RolesGuard)
    @Roles('ADMIN', 'LIBRARIAN')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateFineDto,
    ) {
        return this.fineService.update(id, dto);
    }

    @Patch(':id/pay')
    //không cần role vì người dùng có thể tự trả tiền phạt của mình "nếu sau thêm qr code thì sẽ chỉ cần quét mã để trả tiền phạt""
    payFine(@Param('id', ParseIntPipe) id: number) {
        return this.fineService.payFine(id);
    }

    @Post('generate/overdue')
    @UseGuards(RolesGuard)
    @Roles('ADMIN', 'LIBRARIAN')
    generate() {
        return this.fineService.generateFineFromOverdue();
    }
}