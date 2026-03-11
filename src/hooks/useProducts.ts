import { useQuery, UseQueryOptions, keepPreviousData } from '@tanstack/react-query';
import { PaginatedProductsResponse } from '@/types/productTypes';
import { getAllProducts } from '@/services/productServices';

interface UseProductsProps {
  page: number;
  limit: number;
  search: string;
  makeId?: number;
  categoryId?: number;
  status?: string | string[];
  refCode?: string;
  sortBy: string;
  order: 'asc' | 'desc';
}

export const useProducts = ({
  page,
  limit,
  search,
  makeId,
  categoryId,
  status,
  refCode,
  sortBy,
  order,
}: UseProductsProps) => {
  const options: UseQueryOptions<PaginatedProductsResponse, Error> = {
    queryKey: ['products', page, limit, search, makeId, categoryId, status, refCode, sortBy, order],
    queryFn: () => getAllProducts({ page, limit, search, makeId, categoryId, status, refCode, sortBy, order }),
    placeholderData: keepPreviousData,
  };

  return useQuery(options);
};