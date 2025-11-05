import { useState } from 'react'
import {
  type ColumnDef,
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
import { cn } from '@/lib/utils'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { DataTablePagination, DataTableToolbar } from '@/components/data-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Eye, UserCog } from 'lucide-react'
import type { User, Role } from '@/types/auth'

interface UsersTableProps {
  data: User[]
  roles: Role[]
  onViewUser: (user: User) => void
  onAssignRole: (user: User) => void
}

export function UsersTable({
  data,
  roles,
  onViewUser,
  onAssignRole,
}: UsersTableProps) {
  const [rowSelection, setRowSelection] = useState({})
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [globalFilter, setGlobalFilter] = useState('')

  const getRoleName = (roleId: number) => {
    const role = roles.find((r) => r.id === roleId)
    return role?.name || `Role ${roleId}`
  }

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: 'username',
      header: 'Username',
      cell: ({ row }) => (
        <div className='font-medium'>{row.getValue('username')}</div>
      ),
    },
    {
      accessorKey: 'full_name',
      header: 'Name',
      cell: ({ row }) => <div>{row.getValue('full_name') || '-'}</div>,
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }) => <div>{row.getValue('email')}</div>,
    },
    {
      accessorKey: 'groups',
      header: 'Roles',
      cell: ({ row }) => {
        const groups = row.getValue('groups') as number[]
        return (
          <div>
            {groups && groups.length > 0 ? (
              <div className='flex flex-wrap gap-1'>
                {groups.map((groupId) => (
                  <Badge key={groupId} variant='secondary'>
                    {getRoleName(groupId)}
                  </Badge>
                ))}
              </div>
            ) : (
              <span className='text-muted-foreground text-sm'>
                No roles assigned
              </span>
            )}
          </div>
        )
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className='flex justify-end gap-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => onViewUser(row.original)}
          >
            <Eye className='h-4 w-4' />
            View
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={() => onAssignRole(row.original)}
          >
            <UserCog className='h-4 w-4' />
            Assign Roles
          </Button>
        </div>
      ),
    },
  ]

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: (row, _columnId, filterValue) => {
      const username = String(row.getValue('username')).toLowerCase()
      const email = String(row.getValue('email')).toLowerCase()
      const fullName = String(row.getValue('full_name') || '').toLowerCase()
      const searchValue = String(filterValue).toLowerCase()

      return (
        username.includes(searchValue) ||
        email.includes(searchValue) ||
        fullName.includes(searchValue)
      )
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  return (
    <div className='flex flex-1 flex-col gap-4'>
      <DataTableToolbar
        table={table}
        searchPlaceholder='Filter by username, email, or name...'
      />
      <div className='overflow-hidden rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    className={cn(
                      header.column.columnDef.meta?.className,
                      header.column.columnDef.meta?.thClassName
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
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cn(
                        cell.column.columnDef.meta?.className,
                        cell.column.columnDef.meta?.tdClassName
                      )}
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
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  )
}
