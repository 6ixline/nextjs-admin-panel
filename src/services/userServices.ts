import axios from '@/utils/axiosInstance';
import { BaseResponse, LoginFormData, LoginResponse } from '@/types/formTypes';
import { CreateUser, UserResponse as DeleteUserResponse, GetAllUsersParams, PaginatedUsersResponse, User, UserUpdate } from '@/types/userTypes';

export const submitLoginForm = async (formData: LoginFormData): Promise<LoginResponse> => {
  const response = await axios.post<LoginResponse>('/admin/auth/login', formData);
  return response.data;
};

export const Logout = async (): Promise<BaseResponse> => {
  const response = await axios.post<BaseResponse>('/admin/auth/logout');
  return response.data;
};

export const getAllUsers = async (params: GetAllUsersParams): Promise<PaginatedUsersResponse> => {
  const response = await axios.get<{ data: PaginatedUsersResponse }>('/admin/users', { params });
  return response.data.data;
};

export const deleteUser = async (id: string | number): Promise<DeleteUserResponse> => {
  const response = await axios.delete<{ data: DeleteUserResponse }>(`/admin/users/${id}`);
  return response.data.data;
};

export const getUser = async (id: string | number): Promise<User> => {
  const response = await axios.get<{ data: User }>(`/admin/users/${id}`);
  return response.data.data;
};

export const createUser = async (data: CreateUser): Promise<BaseResponse> => {
  const response = await axios.post<BaseResponse>(`/admin/users`, data);
  return response.data;
};

export const updateUser = async (id : string | number, data: UserUpdate): Promise<BaseResponse> => {
  const response = await axios.put<BaseResponse>(`/admin/users/${id}`, data);
  return response.data;
};


export const bulkUserDelete = async (ids : string[]): Promise<BaseResponse> => {
  const response = await axios.delete<BaseResponse>(`/admin/users/bulk`, {
    data: { ids } 
  });
  return response.data;
};
