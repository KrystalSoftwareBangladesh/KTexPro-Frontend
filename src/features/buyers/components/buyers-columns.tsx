import { type ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { Link } from '@tanstack/react-router'
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { type Buyer } from '@/types/buyer'
import { DataTableRowActions } from './data-table-row-actions'

export const buyersColumns: ColumnDef<Buyer>[] = [
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
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Name' />
    ),
    cell: ({ row }) => (
      <Link
        to='/buyers/$id'
        params={{ id: row.original.id.toString() }}
        className='max-w-36 ps-3 font-medium text-primary hover:underline'
      >
        <LongText>{row.getValue('name')}</LongText>
      </Link>
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
    accessorKey: 'industry',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Industry' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-48'>{row.getValue('industry')}</LongText>
    ),
  },
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Email' />
    ),
    cell: ({ row }) => (
      <div className='w-fit text-nowrap'>{row.getValue('email')}</div>
    ),
  },
  {
    accessorKey: 'phone_number',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Phone' />
    ),
    cell: ({ row }) => (
      <div className='w-fit text-nowrap'>{row.getValue('phone_number')}</div>
    ),
  },
  {
    accessorKey: 'created_by_name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Created By' />
    ),
    cell: ({ row }) => <div>{row.getValue('created_by_name')}</div>,
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Created' />
    ),
    cell: ({ row }) => {
      const date = row.getValue('created_at') as string
      return <div className='text-nowrap'>{format(new Date(date), 'MMM dd, yyyy')}</div>
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
