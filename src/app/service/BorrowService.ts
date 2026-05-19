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

        const response =
            await axiosClient.get(
                API_ENDPOINTS.BORROWS.BASE
            );

        return response.data;
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

        const response =
            await axiosClient.post(
                API_ENDPOINTS.BORROWS.BASE,
                data
            );

        return response.data;
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