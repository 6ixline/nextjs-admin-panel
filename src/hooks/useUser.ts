import { useQuery, UseQueryOptions, keepPreviousData } from '@tanstack/react-query';
import { PaginatedUsersResponse } from '@/types/userTypes';
import { getAllUsers } from '@/services/userServices';

interface UseUsersProps {
  page: number;
  limit: number;
  search: string;
  sortBy: string;
  order: 'asc' | 'desc';
  role: string;
}

export const useUsers = ({
  page,
  limit,
  search,
  sortBy,
  order,
  role = "normal"
}: UseUsersProps) => {
  const options: UseQueryOptions<PaginatedUsersResponse, Error> = {
    queryKey: ['users', page, limit, search, sortBy, order, role],
    queryFn: () => getAllUsers({ page, limit, search, sortBy, order, role }),
    placeholderData: keepPreviousData,
  };

  return useQuery(options);
};