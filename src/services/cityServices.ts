import axios from '@/utils/axiosInstance';
import { BaseResponse } from '@/types/formTypes';
import { Pagination } from '@/types/paginationType';
import { City, PaginatedCityResponse, CityResponse as DeleteCityResponse, CityUpdate, CreateCity } from '@/types/cityTypes';

export const getAllCities = async (params: Pagination): Promise<PaginatedCityResponse> => {
  const response = await axios.get<{ data: PaginatedCityResponse }>('/admin/city', { params });
  return response.data.data;
};

export const deleteCity = async (id: string | number): Promise<DeleteCityResponse> => {
  const response = await axios.delete<{ data: DeleteCityResponse }>(`/admin/city/${id}`);
  return response.data.data;
};

export const getCity = async (id: string | number): Promise<City> => {
  const response = await axios.get<{ data: City }>(`/admin/city/${id}`);
  return response.data.data;
};

export const createCity = async (data: CreateCity): Promise<BaseResponse> => {
  const response = await axios.post<BaseResponse>(`/admin/city/add`, data);
  return response.data;
};

export const updateCity = async (id : string | number, data: CityUpdate): Promise<BaseResponse> => {
  const response = await axios.put<BaseResponse>(`/admin/city/${id}`, data);
  return response.data;
};


export const bulkCityDelete = async (ids : string[]): Promise<BaseResponse> => {
  const response = await axios.delete<BaseResponse>(`/admin/city/bulk`, {
    data: { ids } 
  });
  return response.data;
};
