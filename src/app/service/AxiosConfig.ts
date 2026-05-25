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
        const status = error.response?.status;
        const data = error.response?.data;
        const url = error.config?.url;

        console.error("[v0] API Error:", {
            status,
            url,
            data,
            message: error.message,
        });

        if (status === 401) {
            if (typeof window !== "undefined") {
                localStorage.removeItem("access_token");
                localStorage.removeItem("user");
                // Redirect to login only if not already on login page
                if (!window.location.pathname.includes("/login")) {
                    window.location.href = "/auth/login";
                }
            }
        }

        if (status === 403) {
            console.warn(
                "[v0] Access denied (403). This endpoint may not be available on the backend yet."
            );
        }

        return Promise.reject(error);
    }
);

export default axiosClient;
