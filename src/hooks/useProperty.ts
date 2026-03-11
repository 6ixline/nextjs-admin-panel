import { useQuery, UseQueryOptions, keepPreviousData } from '@tanstack/react-query';
import { PaginationReview } from '@/types/paginationType';
import { PaginatedPropertyResponse } from '@/types/propertyTypes';
import { getAllProperties } from '@/services/propertyServices';

export const useProperty = ({
  page,
  limit,
  search,
  sortBy,
  order,
  status = ""
}: PaginationReview) => {
  const options: UseQueryOptions<PaginatedPropertyResponse, Error> = {
    queryKey: ['properties', page, limit, search, sortBy, order],
    queryFn: () => getAllProperties({ page, limit, search, sortBy, order, status }),
    placeholderData: keepPreviousData,
  };

  return useQuery(options);
};