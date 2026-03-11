import axios from '@/utils/axiosInstance';
import { MakesResponse, CategoriesResponse } from '@/types/makeCategoryTypes';

export const getActiveMakes = async (): Promise<MakesResponse> => {
  const response = await axios.get<MakesResponse>('/admin/catalog/makes/active');
  return response.data;
};

export const getActiveCategories = async (): Promise<CategoriesResponse> => {
  const response = await axios.get<CategoriesResponse>('/admin/catalog/categories/active');
  return response.data;
};