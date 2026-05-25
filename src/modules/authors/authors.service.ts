import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';

@Injectable()
export class AuthorsService {
  constructor(private prisma: PrismaService) { }

  async create(dto: CreateAuthorDto) {
    if (dto.email) {
      const emailExists = await this.prisma.author.findFirst({
        where: { email: dto.email },
      });

      if (emailExists) {
        throw new ConflictException(
          'Email tác giả này đã tồn tại trên hệ thống',
        );
      }
    }

    return this.prisma.author.create({
      data: {
        name: dto.name,
        email: dto.email ?? null,
        location: dto.location ?? null,
        bio: dto.bio ?? null,
        imageUrl: dto.imageUrl ?? null,
        birthDate: dto.birthDate
          ? new Date(dto.birthDate)
          : null,
      },
    });
  }

  async findAll(page = 1, limit = 10, search = '') {
    const skip = (page - 1) * limit;

    // 1. Tìm kiếm theo tên hoặc email tác giả
    const whereCondition = search
      ? {
        OR: [
          { name: { contains: search, mode: 'insensitive' as const } },
          { email: { contains: search, mode: 'insensitive' as const } },
        ],
      }
      : {};

    // 2. Đếm tổng số lượng tác giả thỏa mãn điều kiện
    const total = await this.prisma.author.count({
      where: whereCondition,
    });

    // 3. Lấy dữ liệu phân trang thực tế
    const data = await this.prisma.author.findMany({
      where: whereCondition,
      skip: +skip,
      take: +limit,
      include: {
        _count: {
          select: { books: true },
        },
      },
      orderBy: {
        id: 'desc',
      },
    });

    // 4. Trả về đúng cấu trúc Object phân trang
    return {
      data,
      total,
      page,
      limit,
    };
  }

  async findOne(id: number) {
    const author = await this.prisma.author.findUnique({
      where: { id },
      include: {
        books: {
          take: 10, // tránh load quá nặng
        },
      },
    });

    if (!author) {
      throw new NotFoundException(
        'Không tìm thấy thông tin tác giả yêu cầu',
      );
    }

    return author;
  }

  async update(id: number, dto: UpdateAuthorDto) {
    // check tồn tại
    await this.findOne(id);

    // check email trùng
    if (dto.email) {
      const emailExists = await this.prisma.author.findFirst({
        where: {
          email: dto.email,
          NOT: { id },
        },
      });

      if (emailExists) {
        throw new ConflictException(
          'Email này đã được sử dụng bởi một tác giả khác',
        );
      }
    }

    return this.prisma.author.update({
      where: { id },
      data: {
        name: dto.name,
        email: dto.email ?? undefined,
        location: dto.location ?? undefined,
        bio: dto.bio ?? undefined,
        imageUrl: dto.imageUrl ?? undefined,
        birthDate:
          dto.birthDate !== undefined
            ? dto.birthDate
              ? new Date(dto.birthDate)
              : null
            : undefined,
      },
    });
  }

  async remove(id: number) {
    const author = await this.prisma.author.findUnique({
      where: { id },
      include: {
        books: true,
      },
    });

    if (!author) {
      throw new NotFoundException(
        'Không tìm thấy thông tin tác giả yêu cầu',
      );
    }

    // chặn xóa nếu có sách
    if (author.books.length > 0) {
      throw new ConflictException(
        'Không thể xóa tác giả vì đã có sách liên kết',
      );
    }

    return this.prisma.author.delete({
      where: { id },
    });
  }
}