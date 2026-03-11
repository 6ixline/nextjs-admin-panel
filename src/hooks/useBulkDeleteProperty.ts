import { useMutation, useQueryClient, QueryKey } from '@tanstack/react-query';
import { BaseResponse } from '@/types/formTypes';
import { bulkPropertyDelete } from '@/services/propertyServices';
import {  Property, PaginatedPropertyResponse } from '@/types/propertyTypes';

interface MutationContext {
  previousQueries: [QueryKey, PaginatedPropertyResponse | undefined][];
}

export const useBulkDeleteProperty = () => {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation<
    BaseResponse,     // Mutation result (your API returns BaseResponse)
    Error,            // Error type
    string[],         // Input to the mutationFn: array of user IDs
    MutationContext   // Context passed from onMutate to onError
  >({
    mutationFn: bulkPropertyDelete,

    onMutate: async (propertyIds) => {
      // Cancel any outgoing 'properties' queries to avoid race conditions
      await queryClient.cancelQueries({ queryKey: ['properties'] });

      // Snapshot current state of all 'properties' queries
      const previousQueries = queryClient.getQueriesData<PaginatedPropertyResponse>({
        queryKey: ['properties'],
      });

      // Optimistically update each 'properties' query by removing deleted properties
      queryClient.setQueriesData<PaginatedPropertyResponse>(
        { queryKey: ['properties'] },
        (oldData) => {
          if (!oldData || !oldData.data) return oldData;

          const newProperty = oldData.data.filter(
            (property: Property) => !propertyIds.includes(String(property.id))
          );

          return {
            ...oldData,
            data: newProperty,
          };
        }
      );

      // Return snapshot for rollback
      return { previousQueries };
    },

    onError: (err, propertyIds, context) => {
      console.error('Error bulk deleting property:', err);

      // Rollback changes if mutation failed
      if (context?.previousQueries) {
        context.previousQueries.forEach(([key, data]) => {
          queryClient.setQueryData(key, data);
        });
      }
    },

    onSettled: () => {
      // Always refetch to sync with server state
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
  });

  return deleteMutation;
};
