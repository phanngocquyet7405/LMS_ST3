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

        const response =
            await axiosClient.get(
                API_ENDPOINTS.BOOKS.LIST(
                    page,
                    limit,
                    search
                )
            );

        return response.data;
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

        const response =
            await axiosClient.post(
                API_ENDPOINTS.BOOKS.BASE,
                data
            );

        return response.data;
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