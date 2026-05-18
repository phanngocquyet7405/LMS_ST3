import * as bcrypt from 'bcrypt';
import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../config/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) { }

    async register(dto: RegisterDto) { // Thêm kiểu dữ liệu ở đây
        const exist = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });

        if (exist) {
            throw new BadRequestException('Email đã tồn tại');
        }

        const hash = await bcrypt.hash(dto.password, 10);

        const user = await this.prisma.user.create({
            data: {
                fullName: dto.fullName,
                email: dto.email,
                password: hash,
            },
        });

        // Loại bỏ password trước khi trả về
        const { password, ...result } = user;
        return result;
    }

    async login(dto: LoginDto) { // Thêm kiểu dữ liệu ở đây
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });

        if (!user) {
            throw new UnauthorizedException('Email hoặc mật khẩu không chính xác');
        }

        const compare = await bcrypt.compare(dto.password, user.password);

        if (!compare) {
            throw new UnauthorizedException('Email hoặc mật khẩu không chính xác');
        }

        const accessToken = this.jwtService.sign({
            sub: user.id,
            role: user.role, // Đảm bảo trong schema Prisma của bạn trường này tên là role
        });

        // Loại bỏ password trước khi trả về
        const { password, ...result } = user;

        return {
            accessToken,
            user: result,
        };
    }
}