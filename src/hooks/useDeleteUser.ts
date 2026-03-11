import { useMutation, useQueryClient, QueryKey } from '@tanstack/react-query';
import { deleteUser } from '@/services/userServices'; // Ensure correct import of deleteUser
import { UserResponse as DeleteUserResponse, PaginatedUsersResponse, User } from '@/types/userTypes'; // Make sure to import the types

// Define the context type that will be passed from onMutate to onError
interface MutationContext {
  previousQueries: [QueryKey, PaginatedUsersResponse | undefined][];
}

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  // The useMutation hook with proper types for TData, TError, TVariables, and TContext
  const deleteMutation = useMutation<
    DeleteUserResponse,     // Type of data returned by the mutationFn
    Error,                  // Type of error
    string | number,        // Type of variables passed to mutationFn (userId)
    MutationContext         // Type of context passed between mutation callbacks
  >({
    // The mutationFn should be updated in your services file to return Promise<DeleteUserResponse>
    mutationFn: deleteUser, 

    // onMutate is called before the mutation function.
    // It's ideal for optimistic updates.
    onMutate: async (userId) => {
      // 1. Cancel any outgoing refetches for 'users' queries.
      // This prevents them from overwriting our optimistic update.
      await queryClient.cancelQueries({ queryKey: ['users'] });

      // 2. Snapshot the previous state of all 'users' queries.
      // We use getQueriesData with a partial query key to get all matching queries.
      const previousQueries = queryClient.getQueriesData<PaginatedUsersResponse>({
        queryKey: ['users'],
      });

      // 3. Optimistically update the cache.
      // We use setQueriesData to update all matching queries in the cache.
      queryClient.setQueriesData<PaginatedUsersResponse>(
        { queryKey: ['users'] },
        (oldData) => {
          // If a query has no data or no 'data' array (the user list), we don't change it.
          if (!oldData || !oldData.data) {
            return oldData;
          }

          // Filter out the deleted user from the 'data' array.
          const newUsers = oldData.data.filter(
            (user: User) => user.id !== userId
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
    onError: (err, userId, context) => {
      console.error("Error deleting user:", err);
      // If we have a snapshot of the previous queries, restore it.
      if (context?.previousQueries) {
        context.previousQueries.forEach(([key, data]) => {
          queryClient.setQueryData(key, data);
        });
      }
    },

    // onSettled is called after the mutation is either successful or errors.
    // We use it to invalidate the queries to ensure the client state is in sync with the server.
    // This is what triggers the refetch of the user list.
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  return deleteMutation;
};
