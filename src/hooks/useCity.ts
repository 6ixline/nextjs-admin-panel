import { useQuery, UseQueryOptions, keepPreviousData } from '@tanstack/react-query';
import { getAllCities } from '@/services/cityServices';
import { PaginatedCityResponse } from '@/types/cityTypes';
import { Pagination } from '@/types/paginationType';

export const useCity = ({
  page,
  limit,
  search,
  sortBy,
  order,
}: Pagination) => {
  const options: UseQueryOptions<PaginatedCityResponse, Error> = {
    queryKey: ['cities', page, limit, search, sortBy, order],
    queryFn: () => getAllCities({ page, limit, search, sortBy, order }),
    placeholderData: keepPreviousData,
  };

  return useQuery(options);
};