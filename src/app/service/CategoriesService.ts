import axiosClient from "@/src/app/service/AxiosConfig";
import { API_ENDPOINTS } from "@/src/app/service/apiEndpoint";

import {
    Category,
    CreateCategoryFormValues
} from "@/lib/index";

export const CategoriesService = {
    getAll: async (): Promise<Category[]> => {
        const res = await axiosClient.get(API_ENDPOINTS.CATEGORIES.BASE);
        return res.data;
    },
    getById: async (id: number): Promise<Category> => {
        const res = await axiosClient.get(API_ENDPOINTS.CATEGORIES.BY_ID(id));
        return res.data;
    },
    create: async (data: CreateCategoryFormValues): Promise<Category> => {
        const res = await axiosClient.post(API_ENDPOINTS.CATEGORIES.BASE, data);
        return res.data;
    },
    update: async (id: number, data: Partial<CreateCategoryFormValues>): Promise<Category> => {
        const res = await axiosClient.patch(API_ENDPOINTS.CATEGORIES.BY_ID(id), data);
        return res.data;
    },
    delete: async (id: number): Promise<void> => {
        await axiosClient.delete(API_ENDPOINTS.CATEGORIES.BY_ID(id));
    },
};