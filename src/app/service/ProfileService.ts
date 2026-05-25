import axiosClient from "@/src/app/service/AxiosConfig";
import { API_ENDPOINTS } from "@/src/app/service/apiEndpoint";
import { User } from "@/lib/index";

class ProfileService {
  async getProfile(): Promise<User> {
    try {
      const response = await axiosClient.get(API_ENDPOINTS.PROFILE.ME);
      return response.data;
    } catch (error) {
      console.error("[v0] Error getting profile:", error);
      throw error;
    }
  }

  async updateProfile(data: Partial<User>): Promise<User> {
    try {
      const response = await axiosClient.patch(
        API_ENDPOINTS.PROFILE.UPDATE,
        data
      );
      return response.data;
    } catch (error) {
      console.error("[v0] Error updating profile:", error);
      throw error;
    }
  }

  async changePassword(
    oldPassword: string,
    newPassword: string
  ): Promise<{ message: string }> {
    try {
      const response = await axiosClient.post(
        API_ENDPOINTS.PROFILE.CHANGE_PASSWORD,
        { oldPassword, newPassword }
      );
      return response.data;
    } catch (error) {
      console.error("[v0] Error changing password:", error);
      throw error;
    }
  }

  async uploadAvatar(file: File): Promise<{ imageUrl: string }> {
    try {
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
    } catch (error) {
      console.error("[v0] Error uploading avatar:", error);
      throw error;
    }
  }
}

const profileService = new ProfileService();
export default profileService;
