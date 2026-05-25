import axiosClient from "@/src/app/service/AxiosConfig";
import { API_ENDPOINTS } from "@/src/app/service/apiEndpoint";
import { User } from "@/lib/index";

class ProfileService {
  async getProfile(): Promise<User> {
    const response = await axiosClient.get(API_ENDPOINTS.PROFILE.ME);
    return response.data;
  }

  async updateProfile(data: Partial<User>): Promise<User> {
    const response = await axiosClient.patch(
      API_ENDPOINTS.PROFILE.UPDATE,
      data
    );
    return response.data;
  }

  async changePassword(
    oldPassword: string,
    newPassword: string
  ): Promise<{ message: string }> {
    const response = await axiosClient.post(
      API_ENDPOINTS.PROFILE.CHANGE_PASSWORD,
      { oldPassword, newPassword }
    );
    return response.data;
  }

  async uploadAvatar(file: File): Promise<{ imageUrl: string }> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axiosClient.post(
      API_ENDPOINTS.PROFILE.UPLOAD_AVATAR,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  }
}

const profileService = new ProfileService();
export default profileService;
