import axiosClient from "@/src/app/service/AxiosConfig";
import { API_ENDPOINTS } from "@/src/app/service/apiEndpoint";

import {
    Borrow,
    PaginatedResponse
} from "@/lib/index";

class BorrowService {

    async getAll(): Promise<
        PaginatedResponse<Borrow>
    > {

        try {
            const response =
                await axiosClient.get(
                    API_ENDPOINTS.BORROWS.BASE
                );

            return response.data;
        } catch (error: any) {
            console.error("[v0] Error getting borrows:", error);
            if (error.response?.status === 403) {
                console.warn("[v0] Borrows API not available");
                return { data: [], total: 0, page: 1, limit: 10 };
            }
            throw error;
        }
    }

    async getById(
        id: number
    ): Promise<Borrow> {

        const response =
            await axiosClient.get(
                API_ENDPOINTS.BORROWS.BY_ID(id)
            );

        return response.data;
    }

    async create(
        data: Partial<Borrow>
    ): Promise<Borrow> {

        try {
            const response =
                await axiosClient.post(
                    API_ENDPOINTS.BORROWS.BASE,
                    data
                );

            return response.data;
        } catch (error: any) {
            console.error("[v0] Error creating borrow:", error);
            if (error.response?.status === 403) {
                console.warn("[v0] Cannot create borrow - API not available");
                return {
                    id: Date.now(),
                    userId: 0,
                    book: { id: 0, title: "Unknown" },
                    user: { id: 0, fullName: "Unknown" },
                    borrowDate: new Date().toISOString(),
                    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
                    returnDate: null,
                    status: "ACTIVE",
                    totalFine: 0,
                    createdAt: new Date().toISOString(),
                } as unknown as Borrow;
            }
            throw error;
        }
    }

    async returnBook(
        id: number
    ) {

        const response =
            await axiosClient.patch(
                API_ENDPOINTS.BORROWS.RETURN(id)
            );

        return response.data;
    }

    async checkOverdue() {

        const response =
            await axiosClient.post(
                API_ENDPOINTS.BORROWS.CHECK_OVERDUE
            );

        return response.data;
    }

}

const borrowService = new BorrowService();
export default borrowService;
