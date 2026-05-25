import {
    Injectable,
    NotFoundException,
    ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import { CreateFineDto } from './dto/create-fine.dto';
import { UpdateFineDto } from './dto/update-fine.dto';

@Injectable()
export class FineService {
    constructor(private prisma: PrismaService) { }

    async create(dto: CreateFineDto) {
        const borrow = await this.prisma.borrow.findUnique({
            where: { id: dto.borrowId },
            include: {
                fines: true,
            },
        });

        if (!borrow) {
            throw new NotFoundException('Phiếu mượn không tồn tại');
        }

        if (borrow.fines) {
            throw new ConflictException('Phiếu mượn đã có phạt');
        }

        return this.prisma.fine.create({
            data: {
                borrowId: dto.borrowId,
                amount: dto.amount,
                reason: dto.reason ?? 'Overdue fine',
                status: 'PENDING',
            },
        });
    }

    async findAll() {
        return this.prisma.fine.findMany({
            include: {
                borrow: {
                    include: {
                        user: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }

    async findOne(id: number) {
        const fine = await this.prisma.fine.findUnique({
            where: { id },
            include: {
                borrow: {
                    include: {
                        user: true,
                        items: {
                            include: { book: true },
                        },
                    },
                },
            },
        });

        if (!fine) {
            throw new NotFoundException('Không tìm thấy phạt');
        }

        return fine;
    }

    async update(id: number, dto: UpdateFineDto) {
        const fine = await this.findOne(id);

        return this.prisma.fine.update({
            where: { id },
            data: {
                amount: dto.amount ?? fine.amount,
                reason: dto.reason ?? fine.reason,
            },
        });
    }

    async payFine(id: number) {
        const fine = await this.findOne(id);

        return this.prisma.fine.update({
            where: { id },
            data: {
                status: 'PAID',
            },
        });
    }

    async generateFineFromOverdue() {
        const overdueBorrows = await this.prisma.borrow.findMany({
            where: {
                status: 'OVERDUE',
            },
            include: {
                fines: true,
            },
        });

        let count = 0;

        for (const borrow of overdueBorrows) {
            if (borrow.fines && borrow.fines.length > 0) continue;

            const today = new Date();
            const due = new Date(borrow.dueDate);

            const diffDays = Math.max(
                Math.ceil((today.getTime() - due.getTime()) / (1000 * 60 * 60 * 24)),
                0,
            );

            const amount = diffDays * 5000;

            await this.prisma.fine.create({
                data: {
                    borrowId: borrow.id,
                    amount,
                    reason: `Overdue ${diffDays} days`,
                    status: 'PENDING',
                },
            });

            count++;
        }

        return {
            message: 'Generated fines from overdue',
            count,
        };
    }
}