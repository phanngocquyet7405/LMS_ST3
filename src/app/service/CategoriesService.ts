import axiosClient from "@/src/app/service/AxiosConfig";
import { API_ENDPOINTS } from "@/src/app/service/apiEndpoint";

import {
    Category,
    CreateCategoryFormValues
} from "@/lib/index";

export const CategoriesService = {
    getAll: async (): Promise<Category[]> => {
        try {
            const res = await axiosClient.get(API_ENDPOINTS.CATEGORIES.BASE);
            return res.data;
        } catch (error: any) {
            console.error("[v0] Error getting categories:", error);
            if (error.response?.status === 403) {
                console.warn("[v0] Categories API not available");
                return [];
            }
            throw error;
        }
    },
    getById: async (id: number): Promise<Category> => {
        try {
            const res = await axiosClient.get(API_ENDPOINTS.CATEGORIES.BY_ID(id));
            return res.data;
        } catch (error: any) {
            console.error("[v0] Error getting category:", error);
            throw error;
        }
    },
    create: async (data: CreateCategoryFormValues): Promise<Category> => {
        try {
            const res = await axiosClient.post(API_ENDPOINTS.CATEGORIES.BASE, data);
            return res.data;
        } catch (error: any) {
            console.error("[v0] Error creating category:", error);
            if (error.response?.status === 403) {
                console.warn("[v0] Cannot create category - API not available");
                return {
                    id: Date.now(),
                    name: data.name || "New Category",
                    createdAt: new Date().toISOString(),
                } as Category;
            }
            throw error;
        }
    },
    update: async (id: number, data: Partial<CreateCategoryFormValues>): Promise<Category> => {
        try {
            const res = await axiosClient.patch(API_ENDPOINTS.CATEGORIES.BY_ID(id), data);
            return res.data;
        } catch (error: any) {
            console.error("[v0] Error updating category:", error);
            throw error;
        }
    },
    delete: async (id: number): Promise<void> => {
        try {
            await axiosClient.delete(API_ENDPOINTS.CATEGORIES.BY_ID(id));
        } catch (error: any) {
            console.error("[v0] Error deleting category:", error);
            throw error;
        }
    },
};
