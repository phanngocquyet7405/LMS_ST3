import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';

@Injectable()
export class DashboardService {
    constructor(private prisma: PrismaService) { }

    async getOverview() {
        const [totalBooks, totalBorrows, overdueBorrows, fineRevenue] =
            await Promise.all([
                // 1. total books
                this.prisma.book.count(),

                // 2. total borrows
                this.prisma.borrow.count(),

                // 3. overdue borrows
                this.prisma.borrow.count({
                    where: { status: 'OVERDUE' },
                }),

                // 4. fine revenue (PAID only)
                this.prisma.fine.aggregate({
                    _sum: {
                        amount: true,
                    },
                    where: {
                        status: 'PAID',
                    },
                }),
            ]);

        return {
            totalBooks,
            totalBorrows,
            overdueBorrows,
            fineRevenue: fineRevenue._sum.amount || 0,
        };
    }
}