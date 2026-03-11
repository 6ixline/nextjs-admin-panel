import { getAccountDetails } from '@/services/dashboardServices'
import { useQuery } from '@tanstack/react-query'

export const useAdminUser = () => {
  return useQuery({
    queryKey: ['AdminUser'],
    queryFn: getAccountDetails,
    staleTime: 1000 * 60 * 5,
    retry: false,
  })
}
