'use client'

import React, { useMemo, useState } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  ColumnDef,
  flexRender,
  SortingState,
  ColumnFiltersState,
} from '@tanstack/react-table'
import { Checkbox, IconButton } from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSort, faSortUp, faSortDown, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'
import { TrashBinIcon } from '@/icons'
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

type Person = {
  id: number
  name: string
  email: string
  mobile: string
  status: string
  date: string
}

type DataTableProps<T> = {
  data: T[]
  onDelete?: (ids: string[]) => void
}

function PaginationButton({
  onClick,
  disabled,
  children,
}: {
  onClick: () => void
  disabled: boolean
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="rounded border border-gray-300 dark:border-gray-600 px-3 py-1 text-[#0951a0] hover:bg-[#0951a0] hover:text-white transition disabled:opacity-30"
      aria-disabled={disabled}
    >
      {children}
    </button>
  )
}

function getPaginationRange(currentPage: number, totalPages: number, maxPagesToShow = 5): (number | '...')[] {
  const pages: (number | '...')[] = []
  if (totalPages <= maxPagesToShow) {
    for (let i = 1; i <= totalPages; i++) pages.push(i)
  } else {
    const left = Math.max(2, currentPage - 1)
    const right = Math.min(totalPages - 1, currentPage + 1)

    pages.push(1)
    if (left > 2) pages.push('...')

    for (let i = left; i <= right; i++) pages.push(i)

    if (right < totalPages - 1) pages.push('...')
    pages.push(totalPages)
  }
  return pages
}

export default function DataTable<T extends Person>({ data, onDelete }: DataTableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [bulkAction, setBulkAction] = useState('')

  const columns = useMemo<ColumnDef<T>[]>(() => [
    {
      id: 'select',
      header: ({ table }) => {
        const pageRows = table.getRowModel().rows;
        const allPageRowsSelected = pageRows.length > 0 && pageRows.every(row => row.getIsSelected());
        const somePageRowsSelected = pageRows.some(row => row.getIsSelected());
        return (<Checkbox
              size="small"
              icon={<CheckBoxOutlineBlankIcon sx={{ border: '1px solid #fff', borderRadius: '4px' }} />}
              checkedIcon={<CheckBoxIcon sx={{ border: '1px solid #fff', borderRadius: '4px' }} />}
              checked={allPageRowsSelected}
              indeterminate={!allPageRowsSelected && somePageRowsSelected}
              onChange={() => {
                if (allPageRowsSelected) {
                  pageRows.forEach(row => row.toggleSelected(false));
                } else {
                  pageRows.forEach(row => row.toggleSelected(true));
                }
              }}
          />
        )
      },
      cell: ({ row }) => (
        <Checkbox
          size="small"
          icon={<CheckBoxOutlineBlankIcon sx={{ border: '1px solid #fff', borderRadius: '4px' }} />}
          checkedIcon={<CheckBoxIcon sx={{ border: '1px solid #fff', borderRadius: '4px' }} />}
          checked={row.getIsSelected()}
          onChange={row.getToggleSelectedHandler()}
      />
      ),
    },
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'email', header: 'Email' },
    { accessorKey: 'mobile', header: 'Mobile' },
    { accessorKey: 'status', header: 'Status' },
    { accessorKey: 'date', header: 'Date' },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <IconButton
            size="small"
            onClick={() => alert(`Edit row ${row.index + 1}`)}
            sx={{ color: 'rgb(0, 102, 203)' }}
          >
            <FontAwesomeIcon icon={faEdit} fontSize="small" />
          </IconButton>
          |
          <IconButton
            size="small"
            onClick={() => alert(`Delete row ${row.index + 1}`)}
            sx={{ color: 'rgba(255, 5, 5, 0.7)' }}
          >
            <TrashBinIcon />
          </IconButton>
        </div>
      ),
    },
  ], [])

  const filteredData = useMemo(() => {
    if (!globalFilter) return data
    return data.filter((row) =>
      Object.values(row)
        .join(' ')
        .toLowerCase()
        .includes(globalFilter.toLowerCase())
    )
  }, [data, globalFilter])

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { sorting, columnFilters },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    enableRowSelection: true,
  })

  const selectedRowIds = table.getSelectedRowModel().rows.map((row) => row.id)

  const handleBulkAction = () => {
    if (bulkAction === 'delete' && selectedRowIds.length) {
      onDelete?.(selectedRowIds)
      table.toggleAllRowsSelected(false)
      setBulkAction('')
    }
  }

  const paginationRange = getPaginationRange(
    table.getState().pagination.pageIndex + 1,
    table.getPageCount()
  )

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <select
            className="rounded border border-gray-300 dark:border-gray-600 px-3 py-2 text-xs dark:bg-gray-800 dark:text-white"
            value={bulkAction}
            onChange={(e) => setBulkAction(e.target.value)}
            disabled={selectedRowIds.length === 0}
          >
            <option value="">Bulk Actions</option>
            <option value="delete">Delete Selected</option>
          </select>
          <button
            onClick={handleBulkAction}
            disabled={!bulkAction || selectedRowIds.length === 0}
            className="rounded bg-[#0951a0] px-4 py-2 text-xs text-white disabled:opacity-50 hover:bg-[rgb(50,70,200)] transition"
          >
            Apply
          </button>
        </div>

        <input
          type="text"
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search..."
          className="w-full max-w-[200px] rounded border border-gray-300 px-3 py-2 text-sm dark:bg-gray-800 dark:text-white dark:broder-gray-600"
        />
      </div>

      {/* Table with vertical column dividers and auto width */}
      <div className="overflow-x-auto rounded-sm border border-gray-200 dark:border-gray-700">
        <table className="table-auto min-w-full divide-y divide-gray-200 dark:divide-gray-600 text-sm">
          <thead className="bg-white dark:bg-gray-900">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    style={header.id == "select" || header.id == "actions" ? {width:  100} : undefined}
                    className="px-4 py-0 uppercase text-left text-xs  font-semibold dark:text-white border-r border-gray-200 dark:border-gray-600 last:border-r-0"
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        className={
                          header.column.getCanSort()
                            ? 'cursor-pointer select-none inline-flex items-center gap-1 w-full justify-between'
                            : ''
                        }
                        onClick={(e) => header.column.getToggleSortingHandler()?.(e)}
                        role={header.column.getCanSort() ? 'button' : undefined}
                        tabIndex={header.column.getCanSort() ? 0 : undefined}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault()
                            header.column.getToggleSortingHandler()?.(e)
                          }
                        }}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {(() => {
                          const sortState = header.column.getIsSorted()
                          const iconStyle = { width: '1em', height: '1em' }
                          if (sortState === 'asc') return <FontAwesomeIcon icon={faSortUp} className="text-[#0951a0]" style={iconStyle} />
                          if (sortState === 'desc') return <FontAwesomeIcon icon={faSortDown} className="text-[#0951a0]" style={iconStyle} />
                          return <FontAwesomeIcon icon={faSort} className="text-gray-400" style={iconStyle} />
                        })()}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white dark:bg-gray-900 dark:divide-gray-500">
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className={`px-4 py-1 text-left text-gray-900 dark:text-gray-100 whitespace-nowrap border-r border-gray-100 dark:border-gray-600 last:border-r-0`}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="text-center py-4 text-gray-500 dark:text-gray-400">
                  No data found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex mt-4 items-center justify-between text-sm text-gray-600 dark:text-gray-400">
        

        <select
          className="rounded border border-gray-300 dark:border-gray-600 bg-white px-2 py-1 text-xs dark:bg-gray-800 dark:text-white"
          value={table.getState().pagination.pageSize}
          onChange={(e) => table.setPageSize(Number(e.target.value))}
        >
          {[5, 10, 20, 50].map((size) => (
            <option key={size} value={size}>Show {size}</option>
          ))}
        </select>

        <div className="flex items-center gap-1 rounded-sm">
          <PaginationButton onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
            Previous
          </PaginationButton>

          {paginationRange.map((page, idx) =>
            page === '...' ? (
              <span key={`ellipsis-${idx}`} className="px-2 select-none">...</span>
            ) : (
              <button
                key={page}
                onClick={() => table.setPageIndex(page - 1)}
                className={`rounded px-3 py-1 transition ${
                  table.getState().pagination.pageIndex + 1 === page
                    ? 'bg-[#0951a0] text-white'
                    : 'hover:bg-[#0951a0] hover:text-white text-[#0951a0] border border-transparent'
                }`}
              >
                {page}
              </button>
            )
          )}

          <PaginationButton onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Next
          </PaginationButton>
        </div>
      </div>
    </div>
  )
}