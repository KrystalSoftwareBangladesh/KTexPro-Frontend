import { z } from 'zod'

export const styleSchema = z.object({
  id: z.number(),
  styleNumber: z.string(),
  styleName: z.string(),
  merchandiserId: z.number(),
  supplierId: z.number(),
  buyerId: z.number(),
  season: z.string(),
  brand: z.string(),
  department: z.string(),
  pictureUrl: z.string().optional(),
  currentStatus: z.enum([
    'draft',
    'basic_info_entered',
    'inquiry_received',
    'technical_details_defined',
    'sent_to_supplier',
    'quantity_planned',
    'sample_material_received',
    'sample_cutting_sent',
    'sample_delivery_planned',
    'sample_sent_to_buyer',
    'awaiting_buyer_feedback',
    'documentation_sent',
    'running',
    'drop',
    'place_with_others',
    'production_planned',
  ]),
  buyerSummary: z
    .object({
      id: z.number(),
      name: z.string(),
    })
    .optional(),
  supplierSummary: z
    .object({
      id: z.number(),
      supplierName: z.string(),
    })
    .optional(),
  merchandiserSummary: z
    .object({
      id: z.number(),
      fullName: z.string(),
    })
    .optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export type StyleTable = z.infer<typeof styleSchema>
