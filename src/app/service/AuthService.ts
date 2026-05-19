import axiosClient from "./AxiosConfig";
import { API_ENDPOINTS } from "./apiEndpoint";

import type {
    AuthResponse,
    User
} from "@/lib/index";

/* ── PAYLOADS ───────────────────────────────────────────── */

export interface LoginPayload {
    email: string;
    password: string;
}

export interface RegisterPayload {
    fullName: string;
    email: string;
    password: string;
    phone?: string;
    address?: string;
}

/* ── SERVICE ────────────────────────────────────────────── */

const AuthService = {

    /**
     * đăng ký
     */
    register: async (
        payload: RegisterPayload
    ) => {

        const response =
            await axiosClient.post<User>(
                API_ENDPOINTS.AUTH.REGISTER,
                payload
            );

        return response.data;
    },


    /**
     * login
     */
    login: async (
        payload: LoginPayload
    ) => {

        const response =
            await axiosClient.post<AuthResponse>(
                API_ENDPOINTS.AUTH.LOGIN,
                payload
            );

        const data =
            response.data;

        if (
            typeof window !==
            "undefined"
        ) {

            localStorage.setItem(
                "access_token",
                data.accessToken
            );

            localStorage.setItem(
                "user",
                JSON.stringify(
                    data.user
                )
            );
        }

        return data;
    },


    /**
     * lấy profile user hiện tại
     */
    getProfile: async () => {

        const response =
            await axiosClient.get<User>(
                API_ENDPOINTS.AUTH.ME
            );

        return response.data;
    },


    /**
     * kiểm tra admin
     */
    adminCheck: async () => {

        const response =
            await axiosClient.get<{
                isAdmin: boolean
            }>(
                API_ENDPOINTS.AUTH.ADMIN_CHECK
            );

        return response.data;
    },


    /**
     * logout
     */
    logout: async () => {

        try {

            await axiosClient.post(
                API_ENDPOINTS.AUTH.LOGOUT
            );

        } catch (error) {

            console.log(
                "logout error:",
                error
            );

        } finally {

            if (
                typeof window !==
                "undefined"
            ) {

                localStorage.removeItem(
                    "access_token"
                );

                localStorage.removeItem(
                    "user"
                );

                window.location.href =
                    "/auth/login";
            }
        }

    },


    /**
     * lấy user local
     */

    getCurrentUser:
        (): User | null => {

            if (
                typeof window ===
                "undefined"
            ) {

                return null;
            }

            const user =
                localStorage.getItem(
                    "user"
                );

            if (!user)
                return null;

            return JSON.parse(
                user
            );
        },


    /**
     * check login
     */

    isAuthenticated:
        (): boolean => {

            if (
                typeof window ===
                "undefined"
            ) {

                return false;
            }

            return !!localStorage.getItem(
                "access_token"
            );
        }

};

export default AuthService;