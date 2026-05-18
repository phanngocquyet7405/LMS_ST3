import {
    Injectable,
    NotFoundException,
    ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import { CreateBorrowDto } from './dto/create-borrow.dto';

@Injectable()
export class BorrowService {
    constructor(private prisma: PrismaService) { }

    async create(dto: CreateBorrowDto) {
        return this.prisma.$transaction(async (tx) => {
            // 1. check user
            const user = await tx.user.findUnique({
                where: { id: dto.userId },
            });

            if (!user) {
                throw new NotFoundException('User không tồn tại');
            }

            // cache book để tránh query lại nhiều lần
            const bookCache = new Map<number, any>();

            // 2. validate books + stock
            for (const item of dto.items) {
                let book = bookCache.get(item.bookId);

                if (!book) {
                    book = await tx.book.findUnique({
                        where: { id: item.bookId },
                    });

                    if (!book) {
                        throw new NotFoundException(
                            `Book ID ${item.bookId} không tồn tại`,
                        );
                    }

                    bookCache.set(item.bookId, book);
                }

                if (book.available < item.quantity) {
                    throw new ConflictException(
                        `Sách "${book.title}" không đủ số lượng`,
                    );
                }
            }

            // 3. create borrow
            const borrow = await tx.borrow.create({
                data: {
                    userId: dto.userId,
                    dueDate: new Date(dto.dueDate),
                    status: 'BORROWING',
                },
            });

            // 4. create borrow items + update stock
            for (const item of dto.items) {
                const book = bookCache.get(item.bookId);

                if (!book) {
                    throw new NotFoundException(
                        `Book ID ${item.bookId} không tồn tại`,
                    );
                }

                await tx.borrowItem.create({
                    data: {
                        borrowId: borrow.id,
                        bookId: item.bookId,
                        quantity: item.quantity,
                    },
                });

                await tx.book.update({
                    where: { id: item.bookId },
                    data: {
                        available: book.available - item.quantity,
                    },
                });
            }

            return borrow;
        });
    }

    async findAll() {
        return this.prisma.borrow.findMany({
            include: {
                user: true,
                items: {
                    include: {
                        book: true,
                    },
                },
                fine: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }

    async findOne(id: number) {
        const borrow = await this.prisma.borrow.findUnique({
            where: { id },
            include: {
                user: true,
                items: {
                    include: {
                        book: true,
                    },
                },
                fine: true,
            },
        });

        if (!borrow) {
            throw new NotFoundException('Không tìm thấy phiếu mượn');
        }

        return borrow;
    }

    async returnBorrow(id: number) {
        return this.prisma.$transaction(async (tx) => {
            const borrow = await tx.borrow.findUnique({
                where: { id },
                include: { items: true },
            });

            if (!borrow) {
                throw new NotFoundException('Không tìm thấy phiếu mượn');
            }

            if (borrow.status === 'RETURNED') {
                throw new ConflictException('Phiếu đã được trả');
            }

            const bookCache = new Map<number, any>();

            // restore stock
            for (const item of borrow.items) {
                let book = bookCache.get(item.bookId);

                if (!book) {
                    book = await tx.book.findUnique({
                        where: { id: item.bookId },
                    });

                    if (!book) {
                        throw new NotFoundException(
                            `Book ID ${item.bookId} không tồn tại`,
                        );
                    }

                    bookCache.set(item.bookId, book);
                }

                await tx.book.update({
                    where: { id: item.bookId },
                    data: {
                        available: book.available + item.quantity,
                    },
                });
            }

            // update borrow
            return tx.borrow.update({
                where: { id },
                data: {
                    status: 'RETURNED',
                    returnDate: new Date(),
                },
            });
        });
    }

    async checkOverdue() {
        const borrows = await this.prisma.borrow.findMany({
            where: {
                status: 'BORROWING',
                dueDate: {
                    lt: new Date(),
                },
            },
        });

        for (const borrow of borrows) {
            await this.prisma.borrow.update({
                where: { id: borrow.id },
                data: {
                    status: 'OVERDUE',
                },
            });
        }

        return {
            message: 'Updated overdue borrows',
            count: borrows.length,
        };
    }
}