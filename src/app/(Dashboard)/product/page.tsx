'use client'

import React, { useMemo, useState } from 'react'
import { format, formatDistanceToNow } from 'date-fns'
import { toast } from "sonner";
import { useProducts } from '@/hooks/useProducts'
import { Product } from '@/types/productTypes'
import { ColumnDef, SortingState } from '@tanstack/react-table'
import { DataTable } from '@/components/tables/DataTable'
import PageBreadcrumb from '@/components/common/PageBreadCrumb'
import { useDeleteProduct } from '@/hooks/useDeleteProduct'
import { useBulkDeleteProduct } from '@/hooks/useBulkDeleteProduct';
import { capitalizeFirstChar } from '@/utils/utils';
import Image from 'next/image';

export default function ProductPage() {
  const [pageIndex, setPageIndex] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [sorting, setSorting] = useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = useState('')

  const { mutate: deleteProduct } = useDeleteProduct();
  const { mutate: bulkDeleteProduct } = useBulkDeleteProduct();

  const sortBy = sorting[0]?.id || 'createdAt'
  const order = !sorting[0]?.desc ? 'desc' : 'asc'

  const { data, isLoading, error } = useProducts({
    page: pageIndex + 1,
    limit: pageSize,
    search: globalFilter,
    sortBy,
    order,
  })

  async function onSingleDelete(id: number | string) {
    deleteProduct(id, {
      onSuccess: () => toast.success("Product Deleted!", {
        position: "top-right",
        duration: 3000,
        dismissible: true,
      }),
      onError: (error: any) => {
        const message = error?.response?.data?.message || error.message;
        toast.error(`Delete failed: ${message}`, {
          position: "top-right",
          duration: 3000,
          dismissible: true,
        })
      },
    });
  }

  const bulkDeleteHandler = async (ids: string[]) => {
    bulkDeleteProduct(ids, {
      onSuccess: (response) => {
        toast.success(response.message, {
          position: "top-right",
          duration: 3000,
          dismissible: true,
        })
      },
      onError: (error: any) => {
        const message = error?.response?.data?.message || error.message;
        toast.error(`Delete failed: ${message}`, {
          position: "top-right",
          duration: 3000,
          dismissible: true,
        })
      },
    });
  }

  const columns = useMemo<ColumnDef<Product>[]>(() => [
    {
      accessorKey: 'thumbnail',
      header: 'Image',
      size: 80,
      cell: ({ getValue }) => {
        const thumbnail = getValue() as string | null;
        return (
          <div className="flex items-center justify-center">
            {thumbnail ? (
              <Image
                src={thumbnail}
                alt="Product"
                width={50}
                height={50}
                className="rounded object-cover"
              />
            ) : (
              <div className="w-[50px] h-[50px] bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded flex items-center justify-center border border-gray-300 dark:border-gray-600">
                <svg 
                  className="w-6 h-6 text-gray-400 dark:text-gray-500" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={1.5} 
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
                  />
                </svg>
              </div>
            )}
          </div>
        );
      }
    },
    {
      accessorKey: 'product_code',
      header: 'Product Code',
      size: 150,
      cell: ({ getValue }) => {
        const code = getValue() as string;
        return (
          <div className="min-w-[120px] max-w-[200px]">
            <span className="block truncate" title={code}>
              {code}
            </span>
          </div>
        );
      }
    },
    {
      accessorKey: 'name',
      header: 'Name',
      size: 200,
      cell: ({ getValue }) => {
        const name = getValue() as string;
        return (
          <div className="min-w-[180px] max-w-[300px]">
            <span className="block truncate" title={name}>
              {name}
            </span>
          </div>
        );
      }
    },
    {
      accessorKey: 'make.title',
      header: 'Make',
      size: 120,
      cell: ({ row }) => {
        const make = row.original.make?.title || '-';
        return (
          <div className="min-w-[100px]">
            <span className="block truncate" title={make}>
              {make}
            </span>
          </div>
        );
      }
    },
    {
      accessorKey: 'category.title',
      header: 'Category',
      size: 120,
      cell: ({ row }) => {
        const category = row.original.category?.title || '-';
        return (
          <div className="min-w-[100px]">
            <span className="block truncate" title={category}>
              {category}
            </span>
          </div>
        );
      }
    },
    {
      accessorKey: 'color',
      header: 'Color',
      size: 100,
      cell: ({ getValue }) => {
        const color = getValue() as string | null;
        const displayColor = color || '-';
        return (
          <div className="min-w-[80px] max-w-[120px]">
            <span className="block truncate" title={displayColor}>
              {displayColor}
            </span>
          </div>
        );
      }
    },
    {
      accessorKey: 'mrp',
      header: 'MRP',
      size: 100,
      cell: ({ getValue }) => {
        const mrp = getValue() as string | null;
        return (
          <div className="min-w-[80px]">
            {mrp ? `₹${parseFloat(mrp).toFixed(2)}` : '-'}
          </div>
        );
      }
    },
    {
      accessorKey: 'status',
      header: 'Status',
      size: 120,
      cell: ({ getValue }) => {
        const status = getValue() as string
        let bgColor = "bg-green-600";
        if (status === 'inactive') {
          bgColor = "bg-red-600";
        } else if (status === 'out_of_stock') {
          bgColor = "bg-yellow-600";
        }
        return (
          <div className="min-w-[100px]">
            <span className={`inline-block px-2 py-[2px] text-xs font-medium text-white rounded-full ${bgColor}`}>
              {capitalizeFirstChar(status.replace('_', ' '))}
            </span>
          </div>
        )
      }
    },
    {
      accessorKey: 'createdAt',
      header: 'Created At',
      size: 150,
      cell: ({ getValue }) => {
        const date = getValue() as string
        if (!date) return '-'

        const parsedDate = new Date(date)

        return (
          <div className="min-w-[140px]">
            <div className='text-xs'>{format(parsedDate, 'MMMM dd, yyyy')}</div>
            <div className="text-xs text-gray-500 dark:text-gray-300">({formatDistanceToNow(parsedDate, { addSuffix: true })})</div>
          </div>
        )
      }
    },
  ], [])

  return (
    <div>
      <PageBreadcrumb pageTitle="Products Management" showNewButton link='/product/form' />
      <div className="rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-5 xl:py-10">
        <DataTable
          data={data?.data || []}
          columns={columns}
          totalPages={data?.pagination.totalPages || 1}
          pageIndex={pageIndex}
          pageSize={pageSize}
          sorting={sorting}
          onPageChange={setPageIndex}
          onPageSizeChange={setPageSize}
          onSortingChange={setSorting}
          globalFilter={globalFilter}
          onGlobalFilterChange={setGlobalFilter}
          isLoading={isLoading}
          error={!!error}
          onSingleDelete={onSingleDelete}
          editRoute={"/product"}
          onDelete={bulkDeleteHandler}
        />
      </div>
    </div>
  )
}