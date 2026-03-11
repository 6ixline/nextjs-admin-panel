import { useQuery, UseQueryOptions, keepPreviousData } from '@tanstack/react-query';
import { PaginatedEnquiryResponse } from '@/types/enquiryTypes';
import { Pagination } from '@/types/paginationType';
import { getAllEnquires } from '@/services/enquiryServices';

export const useEnquiry = ({
  page,
  limit,
  search,
  sortBy,
  order,
}: Pagination) => {
  const options: UseQueryOptions<PaginatedEnquiryResponse, Error> = {
    queryKey: ['enquiry', page, limit, search, sortBy, order],
    queryFn: () => getAllEnquires({ page, limit, search, sortBy, order }),
    placeholderData: keepPreviousData,
  };

  return useQuery(options);
};