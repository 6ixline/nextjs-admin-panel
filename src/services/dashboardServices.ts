import { AccountDetailsResponse, DashBoardStatsResponse } from '@/types/dashboardTypes';
import { BaseResponse, PasswordChange } from '@/types/formTypes';
import axios from '@/utils/axiosInstance';

export const getDashboardStats = async (): Promise<DashBoardStatsResponse> => {
    try {
      const response = await axios.get<DashBoardStatsResponse>(`/admin/dashboard`);
      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || "Failed to fetch dashboard stats");
    }
};

export const getAccountDetails = async (): Promise<AccountDetailsResponse> => {
  const response = await axios.get<AccountDetailsResponse>('/admin/auth/me');
  return response.data;
};

export const changePassword = async (data: PasswordChange): Promise<BaseResponse> =>{
  const response = await axios.post<BaseResponse>("/admin/auth/change-password", data);
  return response.data;
}