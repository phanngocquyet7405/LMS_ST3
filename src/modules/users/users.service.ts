import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    // Tìm kiếm theo ID (Trả về thông tin và ẩn password)
    async findById(id: number) {
        const user = await this.prisma.user.findUnique({
            where: { id },
        });
        if (!user) {
            throw new NotFoundException('Không tìm thấy người dùng này trên hệ thống');
        }
        const { password, ...result } = user;
        return result;
    }

    // Tìm kiếm theo Email (Phục vụ cho AuthModule kiểm tra login/register)
    async findByEmail(email: string) {
        return this.prisma.user.findUnique({
            where: { email },
        });
    }

    // Lấy toàn bộ danh sách User kèm phân trang & tìm kiếm (Dành cho Admin/Thủ thư)
    async findAll(page = 1, limit = 10, search = '') {
        const skip = (page - 1) * limit;

        return this.prisma.user.findMany({
            skip: +skip,
            take: +limit,
            where: {
                OR: [
                    { fullName: { contains: search } },
                    { email: { contains: search } },
                ],
            },
            select: {
                id: true,
                fullName: true,
                email: true,
                phone: true,
                address: true,
                role: true,
                createdAt: true,
            },
        });
    }

    // Cập nhật thông tin User
    async update(id: number, dto: UpdateUserDto) {
        // Kiểm tra xem user có tồn tại hay không trước
        await this.findById(id);

        const updatedUser = await this.prisma.user.update({
            where: { id },
            data: dto,
        });

        const { password, ...result } = updatedUser;
        return result;
    }
}