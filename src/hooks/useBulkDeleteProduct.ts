import { useMutation, useQueryClient, QueryKey } from '@tanstack/react-query';
import { bulkProductDelete } from '@/services/productServices';
import { PaginatedProductsResponse, Product } from '@/types/productTypes';
import { BaseResponse } from '@/types/formTypes';

interface MutationContext {
  previousQueries: [QueryKey, PaginatedProductsResponse | undefined][];
}

export const useBulkDeleteProduct = () => {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation<
    BaseResponse,
    Error,
    string[],
    MutationContext
  >({
    mutationFn: bulkProductDelete,

    onMutate: async (productIds) => {
      await queryClient.cancelQueries({ queryKey: ['products'] });

      const previousQueries = queryClient.getQueriesData<PaginatedProductsResponse>({
        queryKey: ['products'],
      });

      queryClient.setQueriesData<PaginatedProductsResponse>(
        { queryKey: ['products'] },
        (oldData) => {
          if (!oldData || !oldData.data) return oldData;

          const newProducts = oldData.data.filter(
            (product: Product) => !productIds.includes(String(product.id))
          );

          return {
            ...oldData,
            data: newProducts,
          };
        }
      );

      return { previousQueries };
    },

    onError: (err, productIds, context) => {
      console.error('Error bulk deleting products:', err);

      if (context?.previousQueries) {
        context.previousQueries.forEach(([key, data]) => {
          queryClient.setQueryData(key, data);
        });
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  return deleteMutation;
};