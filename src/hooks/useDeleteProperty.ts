import { useMutation, useQueryClient, QueryKey } from '@tanstack/react-query';
import { PaginatedPropertyResponse, Property, PropertyResponse as DeletePropertyResponse } from '@/types/propertyTypes';
import { deleteProperty } from '@/services/propertyServices';

// Define the context type that will be passed from onMutate to onError
interface MutationContext {
  previousQueries: [QueryKey, PaginatedPropertyResponse | undefined][];
}

export const useDeleteProperty = () => {
  const queryClient = useQueryClient();

  // The useMutation hook with proper types for TData, TError, TVariables, and TContext
  const deleteMutation = useMutation<
    DeletePropertyResponse,     // Type of data returned by the mutationFn
    Error,                  // Type of error
    string | number,        // Type of variables passed to mutationFn (userId)
    MutationContext         // Type of context passed between mutation callbacks
  >({
    // The mutationFn should be updated in your services file to return Promise<DeleteCityResponse>
    mutationFn: deleteProperty, 

    // onMutate is called before the mutation function.
    // It's ideal for optimistic updates.
    onMutate: async (propertyId) => {
      // 1. Cancel any outgoing refetches for 'properties' queries.
      // This prevents them from overwriting our optimistic update.
      await queryClient.cancelQueries({ queryKey: ['properties'] });

      // 2. Snapshot the previous state of all 'properties' queries.
      // We use getQueriesData with a partial query key to get all matching queries.
      const previousQueries = queryClient.getQueriesData<PaginatedPropertyResponse>({
        queryKey: ['properties'],
      });

      // 3. Optimistically update the cache.
      // We use setQueriesData to update all matching queries in the cache.
      queryClient.setQueriesData<PaginatedPropertyResponse>(
        { queryKey: ['properties'] },
        (oldData) => {
          // If a query has no data or no 'data' array (the user list), we don't change it.
          if (!oldData || !oldData.data) {
            return oldData;
          }

          // Filter out the deleted user from the 'data' array.
          const newUsers = oldData.data.filter(
            (property: Property) => property.id !== propertyId
          );

          // Return the updated data structure, preserving pagination.
          return {
            ...oldData,
            data: newUsers,
          };
        }
      );

      // 4. Return a context object with the snapshotted value.
      // This will be used in onError for rollback.
      return { previousQueries };
    },

    // If the mutation fails, we use the context returned from onMutate to roll back.
    onError: (err, propertyId, context) => {
      console.error("Error deleting property:", err);
      // If we have a snapshot of the previous queries, restore it.
      if (context?.previousQueries) {
        context.previousQueries.forEach(([key, data]) => {
          queryClient.setQueryData(key, data);
        });
      }
    },

    // onSettled is called after the mutation is either successful or errors.
    // We use it to invalidate the queries to ensure the client state is in sync with the server.
    // This is what triggers the refetch of the properties list.
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
  });

  return deleteMutation;
};
