import { useMutation, useQueryClient, QueryKey } from '@tanstack/react-query';
import { BaseResponse } from '@/types/formTypes';
import { Enquiry, PaginatedEnquiryResponse } from '@/types/enquiryTypes';
import { bulkEnquiryDelete } from '@/services/enquiryServices';

interface MutationContext {
  previousQueries: [QueryKey, PaginatedEnquiryResponse | undefined][];
}

export const useBulkDeleteEnquiry = () => {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation<
    BaseResponse,     // Mutation result (your API returns BaseResponse)
    Error,            // Error type
    string[],         // Input to the mutationFn: array of user IDs
    MutationContext   // Context passed from onMutate to onError
  >({
    mutationFn: bulkEnquiryDelete,

    onMutate: async (enquiryIds) => {
      // Cancel any outgoing 'enquiries' queries to avoid race conditions
      await queryClient.cancelQueries({ queryKey: ['enquiry'] });

      // Snapshot current state of all 'enquiries' queries
      const previousQueries = queryClient.getQueriesData<PaginatedEnquiryResponse>({
        queryKey: ['enquiry'],
      });

      // Optimistically update each 'enquiries' query by removing deleted enquiries
      queryClient.setQueriesData<PaginatedEnquiryResponse>(
        { queryKey: ['enquiry'] },
        (oldData) => {
          if (!oldData || !oldData.data) return oldData;

          const newEnquiry = oldData.data.filter(
            (enquiry: Enquiry) => !enquiryIds.includes(String(enquiry.id))
          );

          return {
            ...oldData,
            data: newEnquiry,
          };
        }
      );

      // Return snapshot for rollback
      return { previousQueries };
    },

    onError: (err, enquiryIds, context) => {
      console.error('Error bulk deleting enquiry:', err);

      // Rollback changes if mutation failed
      if (context?.previousQueries) {
        context.previousQueries.forEach(([key, data]) => {
          queryClient.setQueryData(key, data);
        });
      }
    },

    onSettled: () => {
      // Always refetch to sync with server state
      queryClient.invalidateQueries({ queryKey: ['enquiry'] });
    },
  });

  return deleteMutation;
};
