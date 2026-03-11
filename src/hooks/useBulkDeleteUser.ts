import { useMutation, useQueryClient, QueryKey } from '@tanstack/react-query';
import { bulkUserDelete } from '@/services/userServices';
import { PaginatedUsersResponse, User } from '@/types/userTypes';
import { BaseResponse } from '@/types/formTypes';

interface MutationContext {
  previousQueries: [QueryKey, PaginatedUsersResponse | undefined][];
}

export const useBulkDeleteUser = () => {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation<
    BaseResponse,     // Mutation result (your API returns BaseResponse)
    Error,            // Error type
    string[],         // Input to the mutationFn: array of user IDs
    MutationContext   // Context passed from onMutate to onError
  >({
    mutationFn: bulkUserDelete,

    onMutate: async (userIds) => {
      // Cancel any outgoing 'users' queries to avoid race conditions
      await queryClient.cancelQueries({ queryKey: ['users'] });

      // Snapshot current state of all 'users' queries
      const previousQueries = queryClient.getQueriesData<PaginatedUsersResponse>({
        queryKey: ['users'],
      });

      // Optimistically update each 'users' query by removing deleted users
      queryClient.setQueriesData<PaginatedUsersResponse>(
        { queryKey: ['users'] },
        (oldData) => {
          if (!oldData || !oldData.data) return oldData;

          const newUsers = oldData.data.filter(
            (user: User) => !userIds.includes(String(user.id))
          );

          return {
            ...oldData,
            data: newUsers,
          };
        }
      );

      // Return snapshot for rollback
      return { previousQueries };
    },

    onError: (err, userIds, context) => {
      console.error('Error bulk deleting users:', err);

      // Rollback changes if mutation failed
      if (context?.previousQueries) {
        context.previousQueries.forEach(([key, data]) => {
          queryClient.setQueryData(key, data);
        });
      }
    },

    onSettled: () => {
      // Always refetch to sync with server state
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  return deleteMutation;
};
