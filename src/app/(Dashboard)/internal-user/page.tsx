'use client'

import React, { useMemo, useState } from 'react'
import { format, formatDistanceToNow } from 'date-fns'
import { toast } from "sonner";
import { useUsers } from '@/hooks/useUser'
import { User } from '@/types/userTypes'
import { ColumnDef, SortingState } from '@tanstack/react-table'
import { DataTable } from '@/components/tables/DataTable'
import PageBreadcrumb from '@/components/common/PageBreadCrumb'
import { useDeleteUser } from '@/hooks/useDeleteUser'
import { useBulkDeleteUser } from '@/hooks/useBulkDeleteUser';
import { capitalizeFirstChar } from '@/utils/utils';


export default function InternalUsersPage() {
  const [pageIndex, setPageIndex] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [sorting, setSorting] = useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = useState('')

  const { mutate: deleteUser } = useDeleteUser();
  const { mutate: bulkDeleteUser } = useBulkDeleteUser();

  const sortBy = sorting[0]?.id || 'createdAt'
  const order = !sorting[0]?.desc ? 'desc' : 'asc'

  // Filter by role: internal — reusing the same useUsers hook with an added role filter
  const { data, isLoading, error } = useUsers({
    page: pageIndex + 1,
    limit: pageSize,
    search: globalFilter,
    sortBy,
    order,
    role: 'internal',       // <-- only change vs dealer page
  })

  async function onSingleDelete(id: number | string) {
    deleteUser(id, {
      onSuccess: () => toast.success("Record Deleted!", {
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
    bulkDeleteUser(ids, {
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

  const columns = useMemo<ColumnDef<User>[]>(() => [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'email', header: 'Email' },
    { accessorKey: 'mobile', header: 'Mobile' },
    {
      accessorKey: 'status', header: 'Status', cell: ({ getValue }) => {
        const status = getValue() as string
        const bgColor = status === 'active' ? "bg-green-600" : "bg-red-600";
        return (
          <span className={`inline-block px-2 py-[2px] text-xs font-medium text-white rounded-full ${bgColor}`}>
            {capitalizeFirstChar(status)}
          </span>
        )
      }
    },
    {
      accessorKey: 'createdAt', header: 'Created At', cell: ({ getValue }) => {
        const date = getValue() as string
        if (!date) return '-'
        const parsedDate = new Date(date)
        return (
          <div>
            <div className='text-xs'>{format(parsedDate, 'MMMM dd, yyyy')}</div>
            <div className="text-xs text-gray-500 dark:text-gray-300">({formatDistanceToNow(parsedDate, { addSuffix: true })})</div>
          </div>
        )
      }
    },
  ], [])

  return (
    <div>
      <PageBreadcrumb pageTitle="Internal Users" showNewButton link='/internal-user/form' />
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
          editRoute={"/internal-user"}
          onDelete={bulkDeleteHandler}
        />
      </div>
    </div>
  )
}