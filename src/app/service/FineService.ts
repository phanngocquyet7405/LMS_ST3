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

        const response =
            await axiosClient.get(
                API_ENDPOINTS.FINES.BASE
            );

        return response.data;
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