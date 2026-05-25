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

        try {
            const response =
                await axiosClient.get(
                    API_ENDPOINTS.USERS.ME
                );

            return response.data;
        } catch (error) {
            console.error("[v0] Error getting current user:", error);
            throw error;
        }
    }

    async getAll(
        page = 1,
        limit = 10,
        search = ""
    ): Promise<
        PaginatedResponse<User>
    > {

        try {
            const response =
                await axiosClient.get(
                    API_ENDPOINTS.USERS.LIST(
                        page,
                        limit,
                        search
                    )
                );

            return response.data;
        } catch (error) {
            console.error("[v0] Error getting users:", error);
            throw error;
        }
    }

    async getById(
        id: number
    ): Promise<User> {

        try {
            const response =
                await axiosClient.get(
                    API_ENDPOINTS.USERS.BY_ID(id)
                );

            return response.data;
        } catch (error) {
            console.error("[v0] Error getting user by id:", error);
            throw error;
        }
    }

    async update(
        id: number,
        data: Partial<User>
    ): Promise<User> {

        try {
            const response =
                await axiosClient.patch(
                    API_ENDPOINTS.USERS.BY_ID(id),
                    data
                );

            return response.data;
        } catch (error) {
            console.error("[v0] Error updating user:", error);
            throw error;
        }
    }

    async delete(
        id: number
    ) {

        try {
            const response =
                await axiosClient.delete(
                    API_ENDPOINTS.USERS.BY_ID(id)
                );

            return response.data;
        } catch (error) {
            console.error("[v0] Error deleting user:", error);
            throw error;
        }
    }

}

const userService = new UserService();
export default userService;
