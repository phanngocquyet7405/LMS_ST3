import axiosClient from "@/src/app/service/AxiosConfig";
import { API_ENDPOINTS } from "@/src/app/service/apiEndpoint";

import {
    Author,
    PaginatedResponse
} from "@/lib/index";

class AuthorService {

    async getAll(
        page = 1,
        limit = 10,
        search = ""
    ): Promise<PaginatedResponse<Author>> {

        const response =
            await axiosClient.get(
                `${API_ENDPOINTS.AUTHORS.BASE}?page=${page}&limit=${limit}&search=${search}`
            );

        return response.data;
    }

    async getById(
        id: number
    ): Promise<Author> {

        const response =
            await axiosClient.get(
                API_ENDPOINTS.AUTHORS.BY_ID(id)
            );

        return response.data;
    }

    async create(
        data: Partial<Author>
    ): Promise<Author> {

        const response =
            await axiosClient.post(
                API_ENDPOINTS.AUTHORS.BASE,
                data
            );

        return response.data;
    }

    async update(
        id: number,
        data: Partial<Author>
    ): Promise<Author> {

        const response =
            await axiosClient.patch(
                API_ENDPOINTS.AUTHORS.BY_ID(id),
                data
            );

        return response.data;
    }

    async delete(
        id: number
    ) {

        const response =
            await axiosClient.delete(
                API_ENDPOINTS.AUTHORS.BY_ID(id)
            );

        return response.data;
    }

}

const authorService =
    new AuthorService();

export default authorService;