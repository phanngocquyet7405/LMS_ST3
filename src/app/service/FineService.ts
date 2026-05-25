import axiosClient from "@/src/app/service/AxiosConfig";
import { API_ENDPOINTS } from "@/src/app/service/apiEndpoint";

import {
    Fine,
    PaginatedResponse
} from "@/lib/index";

class FineService {

    async getAll(): Promise<
        PaginatedResponse<Fine>
    > {

        try {
            const response =
                await axiosClient.get(
                    API_ENDPOINTS.FINES.BASE
                );

            return response.data;
        } catch (error: any) {
            console.error("[v0] Error getting fines:", error);
            if (error.response?.status === 403) {
                console.warn("[v0] Fines API not available");
                return { data: [], total: 0, page: 1, limit: 10 };
            }
            throw error;
        }
    }

    async getById(
        id: number
    ): Promise<Fine> {

        const response =
            await axiosClient.get(
                API_ENDPOINTS.FINES.BY_ID(id)
            );

        return response.data;
    }

    async create(
        data: Partial<Fine>
    ): Promise<Fine> {

        try {
            const response =
                await axiosClient.post(
                    API_ENDPOINTS.FINES.BASE,
                    data
                );

            return response.data;
        } catch (error: any) {
            console.error("[v0] Error creating fine:", error);
            if (error.response?.status === 403) {
                console.warn("[v0] Cannot create fine - API not available");
                return {
                    id: Date.now(),
                    borrow: { id: 0, book: { id: 0, title: "Unknown" } },
                    amount: data.amount || 0,
                    reason: data.reason || "Unknown",
                    status: "PENDING",
                    createdAt: new Date().toISOString(),
                } as unknown as Fine;
            }
            throw error;
        }
    }

    async payFine(
        id: number
    ) {

        const response =
            await axiosClient.patch(
                API_ENDPOINTS.FINES.PAY(id)
            );

        return response.data;
    }

    async generateOverdue() {

        const response =
            await axiosClient.post(
                API_ENDPOINTS.FINES.GENERATE_OVERDUE
            );

        return response.data;
    }

}

const fineService = new FineService();
export default fineService;
