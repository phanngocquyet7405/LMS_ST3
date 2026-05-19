export const BASE_URL =
    process.env.NEXT_PUBLIC_API_URL ??
    "https://lms-st3.onrender.com/api";

export const API_ENDPOINTS = {

    AUTH: {
        REGISTER: `${BASE_URL}/auth/register`,
        LOGIN: `${BASE_URL}/auth/login`,
        LOGOUT: `${BASE_URL}/auth/logout`,
        ME: `${BASE_URL}/users/me`,
        ADMIN_CHECK: `${BASE_URL}/auth/admin`,
    },

    USERS: {
        BASE: `${BASE_URL}/users`,
        BY_ID: (id: number) => `${BASE_URL}/users/${id}`,
        LIST: (page = 1, limit = 10, search = "") =>
            `${BASE_URL}/users?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`
    },

    BOOKS: {
        BASE: `${BASE_URL}/books`,
        BY_ID: (id: number) => `${BASE_URL}/books/${id}`,
        LIST: (page = 1, limit = 10, search = "") =>
            `${BASE_URL}/books?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`
    },

    AUTHORS: {
        BASE: `${BASE_URL}/authors`,
        BY_ID: (id: number) => `${BASE_URL}/authors/${id}`,
    },

    CATEGORIES: {
        BASE: `${BASE_URL}/categories`,
        BY_ID: (id: number) => `${BASE_URL}/categories/${id}`,
    },

    BORROWS: {
        BASE: `${BASE_URL}/borrows`,
        BY_ID: (id: number) => `${BASE_URL}/borrows/${id}`,
        RETURN: (id: number) => `${BASE_URL}/borrows/${id}/return`,
        CHECK_OVERDUE: `${BASE_URL}/borrows/overdue/check`,
    },

    FINES: {
        BASE: `${BASE_URL}/fines`,
        BY_ID: (id: number) => `${BASE_URL}/fines/${id}`,
        PAY: (id: number) => `${BASE_URL}/fines/${id}/pay`,
        GENERATE_OVERDUE: `${BASE_URL}/fines/generate/overdue`,
    },

    DASHBOARD: {
        OVERVIEW: `${BASE_URL}/dashboard/overview`
    }

} as const;