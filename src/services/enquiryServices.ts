import axios from '@/utils/axiosInstance';
import { BaseResponse } from '@/types/formTypes';
import { Pagination } from '@/types/paginationType';
import { Enquiry, PaginatedEnquiryResponse, EnquiryResponse as DeleteEnquiryResponse, EnquiryUpdate, CreateEnquiry } from '@/types/enquiryTypes';
/**
 */
export const getAllEnquires = async (params: Pagination): Promise<PaginatedEnquiryResponse> => {
  const response = await axios.get<{ data: PaginatedEnquiryResponse }>('/admin/enquiry', { params });
  return response.data.data;
};

export const deleteEnquiry = async (id: string | number): Promise<DeleteEnquiryResponse> => {
  const response = await axios.delete<{ data: DeleteEnquiryResponse }>(`/admin/enquiry/${id}`);
  return response.data.data;
};

export const getEnquiry = async (id: string | number): Promise<Enquiry> => {
  const response = await axios.get<{ data: Enquiry }>(`/admin/enquiry/${id}`);
  return response.data.data;
};

export const createEnquiry = async (data: CreateEnquiry): Promise<BaseResponse> => {
  const response = await axios.post<BaseResponse>(`/admin/enquiry/add`, data);
  return response.data;
};

export const updateEnquiry = async (id : string | number, data: EnquiryUpdate): Promise<BaseResponse> => {
  const response = await axios.put<BaseResponse>(`/admin/enquiry/${id}`, data);
  return response.data;
};


export const bulkEnquiryDelete = async (ids : string[]): Promise<BaseResponse> => {
  const response = await axios.delete<BaseResponse>(`/admin/enquiry/bulk`, {
    data: { ids } 
  });
  return response.data;
};
