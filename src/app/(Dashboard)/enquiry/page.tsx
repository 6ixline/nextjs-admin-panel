'use client'

import React, { useMemo, useState } from 'react'
import { format, formatDistanceToNow } from 'date-fns'
import { toast } from "sonner";
import { ColumnDef, SortingState } from '@tanstack/react-table'
import { DataTable } from '@/components/tables/DataTable'
import PageBreadcrumb from '@/components/common/PageBreadCrumb'
import { capitalizeFirstChar } from '@/utils/utils';
import { useEnquiry } from '@/hooks/useEnquiry';
import { Enquiry } from '@/types/enquiryTypes';
import { useDeleteEnquiry } from '@/hooks/useDeleteEnquiry';
import { useBulkDeleteEnquiry } from '@/hooks/useBulkDeleteEnquiry';

export default function EnquiryPage() {
  const [pageIndex, setPageIndex] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [sorting, setSorting] = useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = useState('')

  // Get the delete user mutation hook
  const { mutate: deleteEnquiry } = useDeleteEnquiry();
  const { mutate: bulkDeleteEnquiry } = useBulkDeleteEnquiry();

  const sortBy = sorting[0]?.id || 'createdAt'
  const order = !sorting[0]?.desc ? 'desc' : 'asc'

  const { data, isLoading, error } = useEnquiry({
    page: pageIndex + 1,
    limit: pageSize,
    search: globalFilter,
    sortBy,
    order,
  })

  async function onSingleDelete(id : number | string){
    deleteEnquiry(id, {
      onSuccess: () =>  toast.success("Record Deleted!", {
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

  const bulkDeleteHandler = async (ids : string[]) => {
    bulkDeleteEnquiry(ids, {
      onSuccess: (response) =>  {
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

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'pending':
        return {
          bg: 'bg-yellow-500',
          label: 'Pending'
        };
      case 'in_progress':
        return {
          bg: 'bg-blue-500',
          label: 'In Progress'
        };
      case 'resolved':
        return {
          bg: 'bg-green-600',
          label: 'Resolved'
        };
      case 'closed':
        return {
          bg: 'bg-gray-600',
          label: 'Closed'
        };
      default:
        return {
          bg: 'bg-gray-500',
          label: capitalizeFirstChar(status)
        };
    }
  };

  const columns = useMemo<ColumnDef<Enquiry>[]>(() => [
    { accessorKey: 'user.name', header: 'Name'},
    { accessorKey: 'user.email', header: 'Email'},
    { accessorKey: 'user.mobile', header: 'Mobile' },
    { accessorKey: 'subject', header: 'Subject', cell: ({ getValue }) => {
      let subject = getValue() as string;
      return (
        <div className="truncate">
          {subject}
        </div>
      );
    } },
    { accessorKey: 'status', header: 'Status', 
      cell: ({ getValue }) => {
        const status = getValue() as string;
        const { bg, label } = getStatusDisplay(status);
        return (
          <span className={`text-nowrap px-2 py-1 text-xs font-sm text-white rounded-full ${bg}`}>
            {label}
          </span>
        );
      }
    },
    { accessorKey: 'createdAt', header: 'Created At', cell: ({ getValue }) => {
      const date = getValue() as string
      if (!date) return '-'
    
      const parsedDate = new Date(date)
    
      return (
        <div>
          <div className='text-xs'>{format(parsedDate, 'MMMM dd, yyyy')}</div>
          <div className="text-xs text-gray-500 dark:text-gray-300">({formatDistanceToNow(parsedDate, { addSuffix: true })})</div>
        </div>
      )
    } },
  ], [])

  return (
    <div>
      <PageBreadcrumb pageTitle="Enquiry" showNewButton={false} />
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
          editRoute={"/enquiry"}
          onDelete={bulkDeleteHandler}
        />
      </div>
    </div>
  )
}