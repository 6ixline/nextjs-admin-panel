'use client'

import React, { useMemo } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  ColumnDef,
  flexRender,
  SortingState,
  ColumnFiltersState,
  OnChangeFn,
} from '@tanstack/react-table'
import { Checkbox, IconButton } from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faSort,
  faSortUp,
  faSortDown,
  faEdit,
} from '@fortawesome/free-solid-svg-icons'
import { TrashBinIcon } from '@/icons'
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank'
import CheckBoxIcon from '@mui/icons-material/CheckBox'
import Swal from 'sweetalert2'
import { Loader } from '../ui/loader/Loader'
import { useRouter } from 'next/navigation'

type PaginationButtonProps = {
  onClick: () => void
  disabled: boolean
  children: React.ReactNode
}
function PaginationButton({ onClick, disabled, children }: PaginationButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="rounded border border-gray-300 dark:border-gray-600 px-3 py-1 text-[#0951a0] hover:bg-[#0951a0] hover:text-white transition disabled:opacity-30"
    >
      {children}
    </button>
  )
}

// Fixed pagination range function
function getPaginationRange(current: number, total: number, maxToShow = 5): (number | '...')[] {
  if (total <= maxToShow) {
    // If total pages is less than maxToShow, show all pages
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  const pages: (number | '...')[] = []
  const showLeftEllipsis = current > 3
  const showRightEllipsis = current < total - 2

  // Always show first page
  pages.push(1)

  if (showLeftEllipsis) {
    pages.push('...')
  }

  // Calculate the range around current page
  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)

  // Add pages around current, but avoid duplicates with first and last
  for (let i = start; i <= end; i++) {
    if (i !== 1 && i !== total) {
      pages.push(i)
    }
  }

  if (showRightEllipsis) {
    pages.push('...')
  }

  // Always show last page if it's different from first
  if (total > 1) {
    pages.push(total)
  }

  return pages
}

type DataTableProps<T> = {
  data: T[]
  columns: ColumnDef<T, any>[]
  pageIndex: number
  pageSize: number
  totalPages: number
  sorting: SortingState
  onPageChange: (idx: number) => void
  onPageSizeChange: (size: number) => void
  onSortingChange: OnChangeFn<SortingState>
  globalFilter: string
  onGlobalFilterChange: (v: string) => void
  onDelete?: (ids: string[]) => void
  isLoading?: boolean
  error?: boolean
  onSingleDelete: (id: number | string) => void
  editRoute: string
  columnWidths?: { [key: string]: number } // Optional column widths
  defaultColumnWidth?: number // Default column width for content cells
}

export function DataTable<T extends { id: number | string }>({
  data,
  columns,
  pageIndex,
  pageSize,
  totalPages,
  sorting,
  onPageChange,
  onPageSizeChange,
  onSortingChange,
  globalFilter,
  onGlobalFilterChange,
  onDelete,
  isLoading = false,
  error = false,
  onSingleDelete,
  editRoute,
  columnWidths = {},
  defaultColumnWidth = 250
}: DataTableProps<T>) {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [bulkAction, setBulkAction] = React.useState('')
  const router = useRouter();
  
  const selectableColumns = useMemo<ColumnDef<T, any>[]>(() => [
    {
      id: 'select',
      header: ({ table }) => {
        const rows = table.getRowModel().rows
        const all = rows.every(r => r.getIsSelected())
        const some = rows.some(r => r.getIsSelected())
        return (
          <Checkbox
            size="small"
            icon={<CheckBoxOutlineBlankIcon sx={{ border: '1px solid #fff', borderRadius: 1 }} />}
            checkedIcon={<CheckBoxIcon sx={{ border: '1px solid #fff', borderRadius: 1 }} />}
            checked={all}
            indeterminate={!all && some}
            onChange={() =>
              rows.forEach(r => (all ? r.toggleSelected(false) : r.toggleSelected(true)))
            }
          />
        )
      },
      cell: ({ row }) => (
        <Checkbox
          size="small"
          icon={<CheckBoxOutlineBlankIcon sx={{ border: '1px solid #fff', borderRadius: 1 }} />}
          checkedIcon={<CheckBoxIcon sx={{ border: '1px solid #fff', borderRadius: 1 }} />}
          checked={row.getIsSelected()}
          onChange={row.getToggleSelectedHandler()}
        />
      ),
    },
    ...columns,
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <IconButton size="small" sx={{ color: 'rgb(0,102,203)' }} onClick={() => {
            router.push(`${editRoute}/form/${row.original.id}`);
          }}>
            <FontAwesomeIcon icon={faEdit} fontSize="small" />
          </IconButton>
          |
          <IconButton size="small" sx={{ color: 'rgba(255,5,5,0.7)' }} onClick={() => {
            Swal.fire({
              title: "Are you sure?",
              text: "You won't be able to revert this!",
              icon: "warning",
              showCancelButton: true,
              confirmButtonColor: "#3085d6",
              cancelButtonColor: "#d33",
              confirmButtonText: "Yes, delete it!",
            }).then((result) => {
              if (result.isConfirmed) {
                onSingleDelete(row.original.id);
              }
            });
          }}>
            <TrashBinIcon />
          </IconButton>
        </div>
      ),
    },
  ], [columns, router, editRoute, onSingleDelete])

  const table = useReactTable({
    data,
    columns: selectableColumns,
    state: { sorting, columnFilters, pagination: { pageIndex, pageSize } },
    onSortingChange,
    onColumnFiltersChange: setColumnFilters,
    manualSorting: true,
    manualFiltering: true,
    manualPagination: true,
    pageCount: totalPages,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  const sel = table.getSelectedRowModel().rows.map(r => String(r.original.id))
  const range = getPaginationRange(pageIndex + 1, totalPages)

  // Function to get column width style
  const getColumnWidthStyle = (column: any) => {
    if (['select', 'actions'].includes(column.id)) {
      return { width: 100 }
    }
    
    const columnKey = column.columnDef?.accessorKey || column.id
    const customWidth = columnWidths[columnKey]
    
    if (customWidth) {
      return { 
        width: `${customWidth}px`,
        maxWidth: `${customWidth}px`,
        minWidth: `${Math.min(customWidth, 100)}px` // Minimum reasonable width
      }
    }
    
    return { 
      maxWidth: `${defaultColumnWidth}px`
    }
  }

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <select disabled={sel.length === 0} value={bulkAction} onChange={e => setBulkAction(e.target.value)} className="rounded border border-gray-300 dark:border-gray-600 px-3 py-2 text-xs dark:bg-gray-800 dark:text-white">
            <option value="">Bulk Actions</option>
            <option value="delete">Delete Selected</option>
          </select>
          <button
            onClick={() => { if (bulkAction === 'delete' && sel.length) { onDelete?.(sel); table.toggleAllRowsSelected(false); setBulkAction(''); } }}
            disabled={!bulkAction || sel.length === 0}
            className="rounded bg-[#0951a0] px-4 py-2 text-xs text-white disabled:opacity-50 hover:bg-[rgb(50,70,200)] transition"
          >
            Apply
          </button>
        </div>
        <input
          type="text"
          value={globalFilter}
          onChange={e => onGlobalFilterChange(e.target.value)}
          placeholder="Search..."
          className="w-full max-w-[200px] rounded border border-gray-300 px-3 py-2 text-sm dark:bg-gray-800 dark:text-white dark:broder-gray-600"
        />
      </div>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <p>Error loading data.</p>
      ) : (
        <>
          <div className="overflow-x-auto rounded-sm border border-gray-200 dark:border-gray-700">
            <table className="table-auto min-w-full divide-y divide-gray-200 dark:divide-gray-600 text-sm">
              <thead className="bg-white dark:bg-gray-900">
                {table.getHeaderGroups().map(hg => (
                  <tr key={hg.id}>
                    {hg.headers.map(h => (
                      <th
                        key={h.id}
                        style={getColumnWidthStyle(h.column)}
                        className="px-4 py-0 uppercase text-left text-xs font-semibold dark:text-white border-r border-gray-200 dark:border-gray-600 last:border-r-0 whitespace-nowrap">
                        {h.isPlaceholder ? null : (
                          <div
                            className={h.column.getCanSort() ? 'cursor-pointer select-none inline-flex items-center gap-1 w-full justify-between' : ''}
                            onClick={h.column.getToggleSortingHandler()}
                          >
                            <span className="truncate">
                              {flexRender(h.column.columnDef.header, h.getContext())}
                            </span>
                            {h.column.getCanSort() && (
                              <span className="flex-shrink-0">
                                {(() => {
                                  const s = h.column.getIsSorted()
                                  if (s === 'asc') return <FontAwesomeIcon icon={faSortUp} className="text-[#0951a0]" />
                                  if (s === 'desc') return <FontAwesomeIcon icon={faSortDown} className="text-[#0951a0]" />
                                  return <FontAwesomeIcon icon={faSort} className="text-gray-400" />
                                })()}
                              </span>
                            )}
                          </div>
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white dark:bg-gray-900 dark:divide-gray-500">
                {table.getRowModel().rows.length ? (
                  table.getRowModel().rows.map(row => (
                    <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                      {row.getVisibleCells().map(cell => (
                        <td 
                          key={cell.id} 
                          style={getColumnWidthStyle(cell.column)}
                          className="px-4 py-1 text-left text-gray-900 dark:text-gray-100 border-r border-gray-100 dark:border-gray-600 last:border-r-0"
                        >
                          <div className="break-words overflow-wrap-anywhere">
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={selectableColumns.length} className="text-center py-4 text-gray-500 dark:text-gray-400">No data found.</td></tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex mt-4 items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <select
              className="rounded border border-gray-300 dark:border-gray-600 bg-white px-2 py-1 text-xs dark:bg-gray-800 dark:text-white"
              value={pageSize}
              onChange={e => onPageSizeChange(Number(e.target.value))}
            >
              {[5,10,20,50].map(sz => <option key={sz} value={sz}>Show {sz}</option>)}
            </select>
            <div className="flex items-center gap-1 rounded-sm">
              <PaginationButton onClick={() => onPageChange(pageIndex - 1)} disabled={!table.getCanPreviousPage()}>
                Previous
              </PaginationButton>
              {range.map((p, i) => (
                p === '...' ? (
                  <span key={`ellipsis-${i}`} className="px-2">…</span>
                ) : (
                  <button
                    key={`page-${p}`}
                    onClick={() => onPageChange((p as number) - 1)}
                    className={`rounded px-3 py-1 transition ${
                      pageIndex + 1 === p
                        ? 'bg-[#0951a0] text-white'
                        : 'hover:bg-[#0951a0] hover:text-white text-[#0951a0]'
                    }`}
                  >
                    {p}
                  </button>
                )
              ))}
              <PaginationButton onClick={() => onPageChange(pageIndex + 1)} disabled={!table.getCanNextPage()}>
                Next
              </PaginationButton>
            </div>
          </div>
        </>
      )}
    </div>
  )
}