import {
    Injectable,
    NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../../config/prisma.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BooksService {
    constructor(
        private prisma: PrismaService,
    ) { }

    async create(
        dto: CreateBookDto
    ) {
        return this.prisma.book.create({
            data: {
                title: dto.title,
                isbn: dto.isbn,
                description: dto.description,
                quantity: dto.quantity ? +dto.quantity : 0,
                available: dto.quantity ? +dto.quantity : 0,
                imageUrl: dto.imageUrl,
                publishYear: +dto.publishYear,
                authorId: dto.authorId ? +dto.authorId : null,
                categoryId: dto.categoryId ? +dto.categoryId : null
            }
        });
    }

    async findAll(page = 1, limit = 10, search = '') {
        const skip = (page - 1) * limit;

        // 1. Đếm tổng số bản ghi thỏa mãn điều kiện search
        const total = await this.prisma.book.count({
            where: {
                OR: [
                    { title: { contains: search } },
                    { isbn: { contains: search } },
                ],
            },
        });

        // 2. Lấy dữ liệu phân trang
        const data = await this.prisma.book.findMany({
            skip: +skip,
            take: +limit,
            where: {
                OR: [
                    { title: { contains: search } },
                    { isbn: { contains: search } },
                ],
            },
            include: {
                category: true,
                author: true
            },
            orderBy: { id: 'desc' }
        });

        // 3. Trả về đúng cấu trúc Frontend cần
        return {
            data,
            total,
            page,
            limit
        };
    }

    async findOne(id: number) {
        const book = await this.prisma.book.findUnique({
            where: { id },
            include: {
                category: true,
                author: true
            }
        });

        if (!book) {
            throw new NotFoundException('Không tìm thấy cuốn sách yêu cầu');
        }

        return book;
    }

    async update(
        id: number,
        dto: UpdateBookDto
    ) {
        await this.findOne(id);

        return this.prisma.book.update({
            where: { id },
            data: {
                title: dto.title,
                isbn: dto.isbn,
                description: dto.description,
                quantity: dto.quantity !== undefined ? +dto.quantity : undefined,
                imageUrl: dto.imageUrl,
                // Cập nhật linh hoạt ID liên kết nếu dữ liệu được truyền lên
                authorId: dto.authorId ? +dto.authorId : (dto.authorId === null ? null : undefined),
                categoryId: dto.categoryId ? +dto.categoryId : (dto.categoryId === null ? null : undefined)
            }
        });
    }

    async remove(
        id: number
    ) {
        await this.findOne(id);

        return this.prisma.book.delete({
            where: { id }
        });
    }
}