import { useMutation, useQueryClient, QueryKey } from '@tanstack/react-query';
import { deleteProduct } from '@/services/productServices';
import { ProductResponse, PaginatedProductsResponse, Product } from '@/types/productTypes';

interface MutationContext {
  previousQueries: [QueryKey, PaginatedProductsResponse | undefined][];
}

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation<
    ProductResponse,
    Error,
    string | number,
    MutationContext
  >({
    mutationFn: deleteProduct,

    onMutate: async (productId) => {
      await queryClient.cancelQueries({ queryKey: ['products'] });

      const previousQueries = queryClient.getQueriesData<PaginatedProductsResponse>({
        queryKey: ['products'],
      });

      queryClient.setQueriesData<PaginatedProductsResponse>(
        { queryKey: ['products'] },
        (oldData) => {
          if (!oldData || !oldData.data) {
            return oldData;
          }

          const newProducts = oldData.data.filter(
            (product: Product) => product.id !== productId
          );

          return {
            ...oldData,
            data: newProducts,
          };
        }
      );

      return { previousQueries };
    },

    onError: (err, productId, context) => {
      console.error("Error deleting product:", err);
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