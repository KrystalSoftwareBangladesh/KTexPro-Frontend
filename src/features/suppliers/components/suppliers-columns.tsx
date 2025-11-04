import { type ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { type Supplier } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'

export const suppliersColumns: ColumnDef<Supplier>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
        className='translate-y-[2px]'
      />
    ),
    meta: {
      className: cn('max-md:sticky start-0 z-10 rounded-tl-[inherit]'),
    },
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
        className='translate-y-[2px]'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'supplierName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Supplier Name' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-40 ps-3 font-medium'>
        {row.getValue('supplierName')}
      </LongText>
    ),
    meta: {
      className: cn(
        'drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.1)] dark:drop-shadow-[0_1px_2px_rgb(255_255_255_/_0.1)]',
        'ps-0.5 max-md:sticky start-6 @4xl/content:table-cell @4xl/content:drop-shadow-none'
      ),
    },
    enableHiding: false,
  },
  {
    accessorKey: 'companyType',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Type' />
    ),
    cell: ({ row }) => {
      const type = row.getValue('companyType') as string
      return (
        <Badge variant='outline' className='capitalize'>
          {type}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'country',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Country' />
    ),
    cell: ({ row }) => <div className='w-fit'>{row.getValue('country')}</div>,
  },
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Email' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-48 lowercase'>{row.getValue('email')}</LongText>
    ),
  },
  {
    accessorKey: 'phoneNumber',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Phone' />
    ),
    cell: ({ row }) => (
      <div className='text-nowrap'>{row.getValue('phoneNumber')}</div>
    ),
  },
  {
    accessorKey: 'capabilities',
    header: 'Capabilities',
    cell: ({ row }) => {
      const capabilities = row.getValue('capabilities') as string[]
      return (
        <div className='flex flex-wrap gap-1'>
          {capabilities.slice(0, 3).map((cap) => (
            <Badge key={cap} variant='secondary' className='text-xs capitalize'>
              {cap}
            </Badge>
          ))}
          {capabilities.length > 3 && (
            <Badge variant='secondary' className='text-xs'>
              +{capabilities.length - 3}
            </Badge>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => {
      const status = row.getValue('status') as string
      const statusColors = {
        active: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20',
        pending: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
        inactive: 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20',
        rejected: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
      }
      return (
        <Badge
          variant='outline'
          className={cn('capitalize', statusColors[status as keyof typeof statusColors])}
        >
          {status}
        </Badge>
      )
    },
    filterFn: (row, id, value) => {
      return Array.isArray(value) && value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: 'totalWorkers',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Workers' />
    ),
    cell: ({ row }) => {
      const workers = row.getValue('totalWorkers') as number
      return <div className='text-nowrap'>{workers.toLocaleString()}</div>
    },
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Created' />
    ),
    cell: ({ row }) => {
      const date = row.getValue('createdAt') as Date
      return <div className='text-nowrap'>{format(date, 'MMM dd, yyyy')}</div>
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
    meta: {
      className: cn('sticky end-0 rounded-tr-[inherit]'),
    },
  },
]
