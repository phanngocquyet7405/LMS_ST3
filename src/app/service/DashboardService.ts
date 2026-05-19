import axiosClient from "@/src/app/service/AxiosConfig";
import { API_ENDPOINTS } from "@/src/app/service/apiEndpoint";
import { DashboardOverview } from "@/lib/index";

class DashboardService {

    async getOverview(): Promise<DashboardOverview> {
        const res = await axiosClient.get(API_ENDPOINTS.DASHBOARD.OVERVIEW);
        return res.data;
    }

}

const dashboardService = new DashboardService();
export default dashboardService;