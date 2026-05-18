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
                // Áp dụng gán mã ID của bảng Tác giả và Danh mục
                authorId: dto.authorId ? +dto.authorId : null,
                categoryId: dto.categoryId ? +dto.categoryId : null
            }
        });
    }

    async findAll(
        page = 1,
        limit = 10,
        search = '',
    ) {
        const skip = (page - 1) * limit;

        return this.prisma.book.findMany({
            skip: +skip,
            take: +limit,
            // Đính kèm song song thông tin chi tiết Danh mục & Tác giả
            include: {
                category: true,
                author: true
            },
            where: {
                OR: [
                    {
                        title: {
                            contains: search,
                        },
                    },
                    {
                        // Truy vấn tìm kiếm theo tên của Tác giả từ quan hệ bảng liên kết
                        author: {
                            name: {
                                contains: search,
                            }
                        },
                    },
                ],
            },
        });
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