import { useState } from 'react'
import {
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { DataTableToolbar } from '@/components/data-table/toolbar'
import { DataTablePagination } from '@/components/data-table/pagination'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'
import { useStyles } from './hooks/use-styles'
import { stylesColumns } from './components/styles-columns'
import { STATUS_LABELS } from './lib/status-labels'
import { StyleFormDialog } from './components/style-form-dialog'

export function StylesPage() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  
  const { data, isLoading } = useStyles({})

  const table = useReactTable({
    data: data?.results || [],
    columns: stylesColumns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  const statusFilterOptions = Object.entries(STATUS_LABELS).map(([value, label]) => ({
    label,
    value,
  }))

  return (
    <>
      <Header fixed>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main fixed>
        <div className='mb-6 flex items-center justify-between'>
          <div>
            <h1 className='text-3xl font-bold tracking-tight'>Styles</h1>
            <p className='text-muted-foreground'>
              Manage style inquiries and production workflow
            </p>
          </div>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className='mr-2 size-4' />
            New Style
          </Button>
        </div>

        <div className='space-y-4'>
          <DataTableToolbar
            table={table}
            searchPlaceholder='Search styles...'
            searchKey='styleNumber'
            filters={[
              {
                columnId: 'currentStatus',
                title: 'Status',
                options: statusFilterOptions,
              },
            ]}
          />
          <div className='@container/table'>
            <div className='rounded-md border'>
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead
                          key={header.id}
                          colSpan={header.colSpan}
                          className={cn(
                            header.column.columnDef.meta?.className ??
                              'max-md:first-of-type:rounded-tl-md max-md:last-of-type:rounded-tr-md'
                          )}
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell
                        colSpan={stylesColumns.length}
                        className='h-24 text-center'
                      >
                        Loading styles...
                      </TableCell>
                    </TableRow>
                  ) : table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && 'selected'}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell
                            key={cell.id}
                            className={cn(cell.column.columnDef.meta?.className)}
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={stylesColumns.length}
                        className='h-24 text-center'
                      >
                        No styles found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
          <DataTablePagination table={table} />
        </div>
      </Main>

      <StyleFormDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
      />
    </>
  )
}
