import {
    Controller,
    Get,
    Patch,
    Body,
    Param,
    Query,
    ParseIntPipe,
    UseGuards,
    Req
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles/roles.guard';
import { Roles } from '../../common/decorators/roles.decorators';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get('me')
    getProfile(@Req() req: any) {
        return this.usersService.findById(req.user.userId);
    }

    @Patch('me')
    updateProfile(@Req() req: any, @Body() dto: UpdateUserDto) {
        const { role, ...data } = dto;
        return this.usersService.update(req.user.userId, data);
    }

    @Get()
    @UseGuards(RolesGuard)
    @Roles('ADMIN', 'LIBRARIAN')
    findAll(
        @Query('page') page?: string,
        @Query('limit') limit?: string,
        @Query('search') search?: string,
    ) {
        return this.usersService.findAll(
            Number(page) || 1,
            Number(limit) || 10,
            search || '',
        );
    }

    @Patch(':id')
    @UseGuards(RolesGuard)
    @Roles('ADMIN')
    updateUser(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateUserDto,
    ) {
        return this.usersService.update(id, dto);
    }
}