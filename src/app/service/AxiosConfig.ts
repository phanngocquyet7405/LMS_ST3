import axios from "axios";
import { BASE_URL } from "./apiEndpoint";

const axiosClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 15000,
});

// ── REQUEST INTERCEPTOR ─────────────────────────────────────
axiosClient.interceptors.request.use(
    (config) => {
        if (typeof window !== "undefined") {
            const token = localStorage.getItem("access_token");
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// ── RESPONSE INTERCEPTOR ────────────────────────────────────
axiosClient.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error("[v0] API Error:", {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message,
        });

        if (error.response?.status === 401) {
            if (typeof window !== "undefined") {
                localStorage.removeItem("access_token");
                localStorage.removeItem("user");
                // Redirect to login only if not already on login page
                if (!window.location.pathname.includes("/login")) {
                    window.location.href = "/auth/login";
                }
            }
        }
        return Promise.reject(error);
    }
);

export default axiosClient;
