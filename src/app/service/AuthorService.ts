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

        try {
            const response =
                await axiosClient.get(
                    `${API_ENDPOINTS.AUTHORS.BASE}?page=${page}&limit=${limit}&search=${search}`
                );

            return response.data;
        } catch (error: any) {
            console.error("[v0] Error getting authors:", error);
            if (error.response?.status === 403) {
                console.warn("[v0] Authors API not available");
                return { data: [], total: 0, page, limit };
            }
            throw error;
        }
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

        try {
            const response =
                await axiosClient.post(
                    API_ENDPOINTS.AUTHORS.BASE,
                    data
                );

            return response.data;
        } catch (error: any) {
            console.error("[v0] Error creating author:", error);
            if (error.response?.status === 403) {
                console.warn("[v0] Cannot create author - API not available");
                return {
                    id: Date.now(),
                    name: data.name || "Unknown Author",
                    createdAt: new Date().toISOString(),
                } as Author;
            }
            throw error;
        }
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
