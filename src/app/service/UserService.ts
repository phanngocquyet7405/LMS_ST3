import axiosClient from "@/src/app/service/AxiosConfig";

import { API_ENDPOINTS }
    from "@/src/app/service/apiEndpoint";

import {
    User,
    PaginatedResponse
}
    from "@/lib/index";

class UserService {

    async me(): Promise<User> {

        const response =
            await axiosClient.get(
                API_ENDPOINTS.USERS.ME
            );

        return response.data;
    }

    async getAll(
        page = 1,
        limit = 10,
        search = ""
    ): Promise<
        PaginatedResponse<User>
    > {

        const response =
            await axiosClient.get(
                API_ENDPOINTS.USERS.LIST(
                    page,
                    limit,
                    search
                )
            );

        return response.data;
    }

    async getById(
        id: number
    ): Promise<User> {

        const response =
            await axiosClient.get(
                API_ENDPOINTS.USERS.BY_ID(id)
            );

        return response.data;
    }

    async update(
        id: number,
        data: Partial<User>
    ): Promise<User> {

        const response =
            await axiosClient.patch(
                API_ENDPOINTS.USERS.BY_ID(id),
                data
            );

        return response.data;
    }

    async delete(
        id: number
    ) {

        const response =
            await axiosClient.delete(
                API_ENDPOINTS.USERS.BY_ID(id)
            );

        return response.data;
    }

}

const userService = new UserService();
export default userService;