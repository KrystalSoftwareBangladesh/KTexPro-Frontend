import { z } from 'zod'

export const buyerStatusSchema = z.union([
  z.literal('active'),
  z.literal('inactive'),
  z.literal('pending'),
  z.literal('archived'),
])
export type BuyerStatus = z.infer<typeof buyerStatusSchema>

export const buyerCategorySchema = z.union([
  z.literal('retail'),
  z.literal('wholesale'),
  z.literal('distributor'),
  z.literal('direct'),
])
export type BuyerCategory = z.infer<typeof buyerCategorySchema>

export const buyerSchema = z.object({
  id: z.string(),
  name: z.string(),
  company: z.string(),
  country: z.string(),
  contactEmail: z.string(),
  contactPhone: z.string(),
  website: z.string().optional(),
  logo: z.string().optional(),
  status: buyerStatusSchema,
  category: buyerCategorySchema,
  relationshipSince: z.coerce.date(),
  keyAccountManager: z.string(),
  notes: z.string().optional(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})
export type Buyer = z.infer<typeof buyerSchema>

export const buyerListSchema = z.array(buyerSchema)

export const buyerContactSchema = z.object({
  id: z.string(),
  buyerId: z.string(),
  name: z.string(),
  designation: z.string(),
  email: z.string(),
  phone: z.string(),
  department: z.string(),
  isPrimary: z.boolean(),
  createdAt: z.coerce.date(),
})
export type BuyerContact = z.infer<typeof buyerContactSchema>

export const orderStatusSchema = z.union([
  z.literal('pending'),
  z.literal('in_production'),
  z.literal('shipped'),
  z.literal('completed'),
  z.literal('cancelled'),
])
export type OrderStatus = z.infer<typeof orderStatusSchema>

export const buyerOrderSchema = z.object({
  id: z.string(),
  buyerId: z.string(),
  orderNumber: z.string(),
  orderDate: z.coerce.date(),
  status: orderStatusSchema,
  totalValue: z.number(),
  currency: z.string(),
  deliveryDate: z.coerce.date(),
  productsCount: z.number(),
})
export type BuyerOrder = z.infer<typeof buyerOrderSchema>

export const paymentTermSchema = z.union([
  z.literal('LC'),
  z.literal('TT'),
  z.literal('COD'),
  z.literal('NET30'),
  z.literal('NET60'),
])
export type PaymentTerm = z.infer<typeof paymentTermSchema>

export const incotermsSchema = z.union([
  z.literal('FOB'),
  z.literal('CIF'),
  z.literal('EXW'),
  z.literal('DDP'),
  z.literal('FCA'),
])
export type Incoterms = z.infer<typeof incotermsSchema>

export const buyerPricingSchema = z.object({
  id: z.string(),
  buyerId: z.string(),
  productCategory: z.string(),
  priceRange: z.string(),
  paymentTerms: paymentTermSchema,
  currency: z.string(),
  incoterms: incotermsSchema,
  bankDetails: z.string().optional(),
  freightInfo: z.string().optional(),
  updatedAt: z.coerce.date(),
})
export type BuyerPricing = z.infer<typeof buyerPricingSchema>

export const complianceCertificateSchema = z.union([
  z.literal('BSCI'),
  z.literal('SEDEX'),
  z.literal('WRAP'),
  z.literal('GOTS'),
  z.literal('OEKO-TEX'),
  z.literal('ISO9001'),
  z.literal('ISO14001'),
])
export type ComplianceCertificate = z.infer<typeof complianceCertificateSchema>

export const buyerComplianceSchema = z.object({
  id: z.string(),
  buyerId: z.string(),
  certificateType: complianceCertificateSchema,
  certificateNumber: z.string(),
  issuedDate: z.coerce.date(),
  expiryDate: z.coerce.date(),
  isValid: z.boolean(),
  fileUrl: z.string().optional(),
})
export type BuyerCompliance = z.infer<typeof buyerComplianceSchema>

export const communicationTypeSchema = z.union([
  z.literal('meeting'),
  z.literal('email'),
  z.literal('call'),
  z.literal('video_call'),
])
export type CommunicationType = z.infer<typeof communicationTypeSchema>

export const buyerCommunicationSchema = z.object({
  id: z.string(),
  buyerId: z.string(),
  type: communicationTypeSchema,
  subject: z.string(),
  notes: z.string(),
  date: z.coerce.date(),
  participants: z.array(z.string()),
  attachments: z.array(z.string()).optional(),
  followUpDate: z.coerce.date().optional(),
  createdBy: z.string(),
})
export type BuyerCommunication = z.infer<typeof buyerCommunicationSchema>

export const sampleStatusSchema = z.union([
  z.literal('pending'),
  z.literal('in_development'),
  z.literal('sent'),
  z.literal('approved'),
  z.literal('rejected'),
])
export type SampleStatus = z.infer<typeof sampleStatusSchema>

export const buyerSampleSchema = z.object({
  id: z.string(),
  buyerId: z.string(),
  sampleName: z.string(),
  designCode: z.string(),
  requestDate: z.coerce.date(),
  sentDate: z.coerce.date().optional(),
  status: sampleStatusSchema,
  comments: z.string().optional(),
  imageUrl: z.string().optional(),
})
export type BuyerSample = z.infer<typeof buyerSampleSchema>

export const buyerDocumentSchema = z.object({
  id: z.string(),
  buyerId: z.string(),
  documentName: z.string(),
  documentType: z.string(),
  fileUrl: z.string(),
  uploadedBy: z.string(),
  uploadedAt: z.coerce.date(),
  fileSize: z.number(),
})
export type BuyerDocument = z.infer<typeof buyerDocumentSchema>

export const buyerAnalyticsSchema = z.object({
  buyerId: z.string(),
  totalOrders: z.number(),
  totalRevenue: z.number(),
  averageOrderValue: z.number(),
  onTimeDeliveryRate: z.number(),
  paymentPerformance: z.number(),
  yearlyOrders: z.array(
    z.object({
      year: z.number(),
      orders: z.number(),
      revenue: z.number(),
    })
  ),
})
export type BuyerAnalytics = z.infer<typeof buyerAnalyticsSchema>
