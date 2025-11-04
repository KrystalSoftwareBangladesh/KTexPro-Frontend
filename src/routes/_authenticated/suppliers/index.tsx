import { z } from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { Suppliers } from '@/features/suppliers'
import { companyTypes, supplierStatuses } from '@/features/suppliers/data/data'

const suppliersSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  status: z
    .array(
      z.union([
        z.literal('active'),
        z.literal('pending'),
        z.literal('inactive'),
        z.literal('rejected'),
      ])
    )
    .optional()
    .catch([]),
  type: z
    .array(
      z.enum(
        companyTypes.map((c) => c.value as (typeof companyTypes)[number]['value'])
      )
    )
    .optional()
    .catch([]),
  name: z.string().optional().catch(''),
  country: z.string().optional().catch(''),
})

export const Route = createFileRoute('/_authenticated/suppliers/')({
  validateSearch: suppliersSearchSchema,
  component: Suppliers,
})
