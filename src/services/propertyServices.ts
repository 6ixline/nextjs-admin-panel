import axios from '@/utils/axiosInstance';
import { BaseResponse } from '@/types/formTypes';
import { PaginationReview } from '@/types/paginationType';
import { PaginatedPropertyResponse, PropertyResponse as DeletePropertyResponse, PropertyDetails, PropertyTypeResponse, AmenityResponse, PropertyRequest } from '@/types/propertyTypes';

export const getAllProperties = async (params: PaginationReview): Promise<PaginatedPropertyResponse> => {
  const response = await axios.get<{ data: PaginatedPropertyResponse }>('/admin/property', { params });
  return response.data.data;
};

export const deleteProperty = async (id: string | number): Promise<DeletePropertyResponse> => {
  const response = await axios.delete<{ data: DeletePropertyResponse }>(`/admin/property/${id}`);
  return response.data.data;
};

export const getProperty = async (id: string | number): Promise<PropertyDetails> => {
  const response = await axios.get<{ data: PropertyDetails }>(`/admin/property/${id}`);
  return response.data.data;
};

export const createProperty = async (data: PropertyRequest): Promise<BaseResponse> => {
  const response = await axios.post<BaseResponse>(`/admin/property/add`, data);
  return response.data;
};

export const updateProperty = async (id : string | number, data: PropertyRequest): Promise<BaseResponse> => {
  const response = await axios.put<BaseResponse>(`/admin/property/${id}`, data);
  return response.data;
};

export const bulkPropertyDelete = async (ids : string[]): Promise<BaseResponse> => {
  const response = await axios.delete<BaseResponse>(`/admin/property/bulk`, {
    data: { ids } 
  });
  return response.data;
};

export const getAllPropertiesSubTypeByCategory = async (): Promise<PropertyTypeResponse> => {
  const response = await axios.get<PropertyTypeResponse>('/property/type/grouped-by-category');
  return response.data;
};

export const getAllAmenities = async (): Promise<AmenityResponse> => {
  const response = await axios.get<AmenityResponse>('/property/amenity/grouped-by-category');
  return response.data;
};

