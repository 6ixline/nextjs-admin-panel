import axios from '@/utils/axiosInstance';
import { BaseResponse } from '@/types/formTypes';
import {
  CreateProduct,
  ProductResponse,
  GetAllProductsParams,
  PaginatedProductsResponse,
  Product,
  ProductUpdate
} from '@/types/productTypes';

export const getAllProducts = async (params: GetAllProductsParams): Promise<PaginatedProductsResponse> => {
  const response = await axios.get<{ data: PaginatedProductsResponse }>('/admin/catalog/products', { params });
  return response.data.data;
};

export const deleteProduct = async (id: string | number): Promise<ProductResponse> => {
  const response = await axios.delete<{ data: ProductResponse }>(`/admin/catalog/products/${id}`);
  return response.data.data;
};

export const getProduct = async (id: string | number): Promise<Product> => {
  const response = await axios.get<{ data: Product }>(`/admin/catalog/products/${id}`);
  return response.data.data;
};

export const createProduct = async (data: CreateProduct): Promise<BaseResponse> => {
  const response = await axios.post<BaseResponse>(`/admin/catalog/products`, data);
  return response.data;
};

export const updateProduct = async (id: string | number, data: ProductUpdate): Promise<BaseResponse> => {
  const response = await axios.put<BaseResponse>(`/admin/catalog/products/${id}`, data);
  return response.data;
};

export const bulkProductDelete = async (ids: string[]): Promise<BaseResponse> => {
  const response = await axios.post<BaseResponse>(`/admin/catalog/products/bulk-delete`, {
    ids
  });
  return response.data;
};

export const bulkProductStatusUpdate = async (ids: string[], status: string): Promise<BaseResponse> => {
  const response = await axios.post<BaseResponse>(`/admin/catalog/products/bulk-update-status`, {
    ids,
    status
  });
  return response.data;
};