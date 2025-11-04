import { Buyers } from '@/features/buyers'
import { buyerCategories } from '@/features/buyers/data/data'
import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

const buyersSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  status: z
    .array(
      z.union([
        z.literal('active'),
        z.literal('inactive'),
        z.literal('pending'),
        z.literal('archived'),
      ])
    )
    .optional()
    .catch([]),
  category: z
    .array(
      z.enum(
        buyerCategories.map((c) => c.value as (typeof buyerCategories)[number]['value'])
      )
    )
    .optional()
    .catch([]),
  name: z.string().optional().catch(''),
  country: z.string().optional().catch(''),
})

export const Route = createFileRoute('/_authenticated/buyers/')({
  validateSearch: buyersSearchSchema,
  component: Buyers,
})
