import { type ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { Link } from '@tanstack/react-router'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { type StyleTable } from '../data/schema'
import { STATUS_LABELS, STATUS_VARIANTS } from '../lib/status-labels'

export const stylesColumns: ColumnDef<StyleTable>[] = [
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
    accessorKey: 'styleNumber',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Style Number' />
    ),
    cell: ({ row }) => (
      <Link
        to='/styles/$id'
        params={{ id: row.original.id.toString() }}
        className='max-w-36 ps-3 font-medium text-primary hover:underline'
      >
        <LongText>{row.getValue('styleNumber')}</LongText>
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
    accessorKey: 'styleName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Style Name' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-48'>{row.getValue('styleName')}</LongText>
    ),
  },
  {
    accessorKey: 'buyerSummary',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Buyer' />
    ),
    cell: ({ row }) => {
      const buyer = row.getValue('buyerSummary') as StyleTable['buyerSummary']
      return <div>{buyer?.name || '-'}</div>
    },
  },
  {
    accessorKey: 'supplierSummary',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Supplier' />
    ),
    cell: ({ row }) => {
      const supplier = row.getValue(
        'supplierSummary'
      ) as StyleTable['supplierSummary']
      return <div>{supplier?.supplierName || '-'}</div>
    },
  },
  {
    accessorKey: 'season',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Season' />
    ),
    cell: ({ row }) => <div>{row.getValue('season')}</div>,
  },
  {
    accessorKey: 'brand',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Brand' />
    ),
    cell: ({ row }) => <div>{row.getValue('brand')}</div>,
  },
  {
    accessorKey: 'currentStatus',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => {
      const status = row.getValue('currentStatus') as StyleTable['currentStatus']
      return (
        <Badge variant={STATUS_VARIANTS[status]}>
          {STATUS_LABELS[status]}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Created' />
    ),
    cell: ({ row }) => {
      const date = row.getValue('createdAt') as string
      return (
        <div className='text-nowrap'>
          {format(new Date(date), 'MMM dd, yyyy')}
        </div>
      )
    },
  },
]
