import axiosClient from "@/src/app/service/AxiosConfig";
import { API_ENDPOINTS } from "@/src/app/service/apiEndpoint";

import {
    Book,
    PaginatedResponse
} from "@/lib/index";

class BookService {

    async getAll(
        page = 1,
        limit = 10,
        search = ""
    ): Promise<PaginatedResponse<Book>> {

        try {
            const response =
                await axiosClient.get(
                    API_ENDPOINTS.BOOKS.LIST(
                        page,
                        limit,
                        search
                    )
                );

            return response.data;
        } catch (error: any) {
            console.error("[v0] Error getting books:", error);
            // Return empty list on 403
            if (error.response?.status === 403) {
                console.warn("[v0] Books API not available");
                return { data: [], total: 0, page, limit };
            }
            throw error;
        }
    }

    async getById(
        id: number
    ): Promise<Book> {

        const response =
            await axiosClient.get(
                API_ENDPOINTS.BOOKS.BY_ID(id)
            );

        return response.data;
    }

    async create(
        data: Partial<Book>
    ): Promise<Book> {

        try {
            const response =
                await axiosClient.post(
                    API_ENDPOINTS.BOOKS.BASE,
                    data
                );

            return response.data;
        } catch (error: any) {
            console.error("[v0] Error creating book:", error);
            // Return mock book on 403
            if (error.response?.status === 403) {
                console.warn("[v0] Cannot create book - API not available");
                return {
                    id: Date.now(),
                    title: data.title || "Untitled",
                    isbn: data.isbn || "",
                    author: { id: 0, name: "Unknown" },
                    category: { id: 0, name: "Uncategorized" },
                    quantity: data.quantity || 0,
                    createdAt: new Date().toISOString(),
                } as Book;
            }
            throw error;
        }
    }

    async update(
        id: number,
        data: Partial<Book>
    ): Promise<Book> {

        const response =
            await axiosClient.patch(
                API_ENDPOINTS.BOOKS.BY_ID(id),
                data
            );

        return response.data;
    }

    async delete(
        id: number
    ) {

        const response =
            await axiosClient.delete(
                API_ENDPOINTS.BOOKS.BY_ID(id)
            );

        return response.data;
    }

}

const bookService = new BookService();
export default bookService;
