import {
    Injectable,
    NotFoundException,
    ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
    constructor(private prisma: PrismaService) { }

    async create(dto: CreateCategoryDto) {
        const exists = await this.prisma.category.findUnique({
            where: { name: dto.name },
        });

        if (exists) {
            throw new ConflictException('Danh mục này đã tồn tại');
        }

        return this.prisma.category.create({
            data: {
                name: dto.name,
                description: dto.description ?? null,
            },
        });
    }

    async findAll() {
        return this.prisma.category.findMany({
            include: {
                _count: {
                    select: { books: true },
                },
            },
            orderBy: {
                id: 'desc',
            },
        });
    }

    async findOne(id: number) {
        const category = await this.prisma.category.findUnique({
            where: { id },
            include: {
                books: {
                    take: 10, // tránh load nặng
                },
                _count: {
                    select: { books: true },
                },
            },
        });

        if (!category) {
            throw new NotFoundException('Không tìm thấy danh mục');
        }

        return category;
    }

    async update(id: number, dto: UpdateCategoryDto) {
        await this.findOne(id);

        if (dto.name) {
            const exists = await this.prisma.category.findFirst({
                where: {
                    name: dto.name,
                    NOT: { id },
                },
            });

            if (exists) {
                throw new ConflictException('Tên danh mục đã tồn tại');
            }
        }

        return this.prisma.category.update({
            where: { id },
            data: {
                name: dto.name,
                description: dto.description,
            },
        });
    }

    async remove(id: number) {
        const category = await this.prisma.category.findUnique({
            where: { id },
            include: {
                books: true,
            },
        });

        if (!category) {
            throw new NotFoundException('Không tìm thấy danh mục');
        }

        if (category.books.length > 0) {
            throw new ConflictException(
                'Không thể xóa danh mục đang chứa sách',
            );
        }

        return this.prisma.category.delete({
            where: { id },
        });
    }
}