import { useMutation, useQueryClient, QueryKey } from '@tanstack/react-query';
import { BaseResponse } from '@/types/formTypes';
import { bulkCityDelete } from '@/services/cityServices';
import { City, PaginatedCityResponse } from '@/types/cityTypes';

interface MutationContext {
  previousQueries: [QueryKey, PaginatedCityResponse | undefined][];
}

export const useBulkDeleteCity = () => {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation<
    BaseResponse,     // Mutation result (your API returns BaseResponse)
    Error,            // Error type
    string[],         // Input to the mutationFn: array of user IDs
    MutationContext   // Context passed from onMutate to onError
  >({
    mutationFn: bulkCityDelete,

    onMutate: async (cityIds) => {
      // Cancel any outgoing 'cities' queries to avoid race conditions
      await queryClient.cancelQueries({ queryKey: ['cities'] });

      // Snapshot current state of all 'cities' queries
      const previousQueries = queryClient.getQueriesData<PaginatedCityResponse>({
        queryKey: ['cities'],
      });

      // Optimistically update each 'cities' query by removing deleted cities
      queryClient.setQueriesData<PaginatedCityResponse>(
        { queryKey: ['cities'] },
        (oldData) => {
          if (!oldData || !oldData.data) return oldData;

          const newCity = oldData.data.filter(
            (city: City) => !cityIds.includes(String(city.id))
          );

          return {
            ...oldData,
            data: newCity,
          };
        }
      );

      // Return snapshot for rollback
      return { previousQueries };
    },

    onError: (err, cityIds, context) => {
      console.error('Error bulk deleting city:', err);

      // Rollback changes if mutation failed
      if (context?.previousQueries) {
        context.previousQueries.forEach(([key, data]) => {
          queryClient.setQueryData(key, data);
        });
      }
    },

    onSettled: () => {
      // Always refetch to sync with server state
      queryClient.invalidateQueries({ queryKey: ['cities'] });
    },
  });

  return deleteMutation;
};
