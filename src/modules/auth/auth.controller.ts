import {
    Body,
    Controller,
    Post,
    Get,
    Req,
    UseGuards
} from '@nestjs/common';

import type { Request } from 'express';

import { AuthService } from './auth.service';

import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

import { JwtAuthGuard } from '../../common/guards/jwt-auth/jwt-auth.guard';

import { RolesGuard } from '../../common/guards/roles/roles.guard';
import { Roles } from '../../common/decorators/roles.decorators';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('register')
    register(@Body() dto: RegisterDto) {
        return this.authService.register(dto);
    }

    @Post('login')
    login(@Body() dto: LoginDto) {
        return this.authService.login(dto);
    }

    @Get('admin-check')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    adminRoute() {
        return { message: 'Only Admin' };
    }
}