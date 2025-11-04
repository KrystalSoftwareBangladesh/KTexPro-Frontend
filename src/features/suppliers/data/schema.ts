import { z } from 'zod'

export const companyTypeSchema = z.union([
  z.literal('factory'),
  z.literal('trader'),
])
export type CompanyType = z.infer<typeof companyTypeSchema>

export const supplierStatusSchema = z.union([
  z.literal('active'),
  z.literal('pending'),
  z.literal('inactive'),
  z.literal('rejected'),
])
export type SupplierStatus = z.infer<typeof supplierStatusSchema>

export const capabilitySchema = z.union([
  z.literal('yarn'),
  z.literal('knitting'),
  z.literal('dyeing'),
  z.literal('sewing'),
  z.literal('printing'),
  z.literal('embroidery'),
  z.literal('washing'),
  z.literal('accessories'),
])
export type Capability = z.infer<typeof capabilitySchema>

export const certificationTypeSchema = z.union([
  z.literal('BSCI'),
  z.literal('SEDEX'),
  z.literal('WRAP'),
  z.literal('GOTS'),
  z.literal('OEKO-TEX'),
  z.literal('ISO9001'),
  z.literal('ISO14001'),
  z.literal('SA8000'),
])
export type CertificationType = z.infer<typeof certificationTypeSchema>

export const paymentTermSchema = z.union([
  z.literal('LC'),
  z.literal('TT'),
  z.literal('NET30'),
  z.literal('NET60'),
  z.literal('COD'),
])
export type PaymentTerm = z.infer<typeof paymentTermSchema>

export const contactPersonSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  designation: z.string().min(1, 'Designation is required'),
  phone: z.string().min(1, 'Phone is required'),
  email: z.string().email('Invalid email address'),
})
export type ContactPerson = z.infer<typeof contactPersonSchema>

export const certificationSchema = z.object({
  id: z.string(),
  type: certificationTypeSchema,
  certificateNumber: z.string(),
  issuedDate: z.coerce.date(),
  expiryDate: z.coerce.date(),
  fileUrl: z.string().optional(),
})
export type Certification = z.infer<typeof certificationSchema>

export const supplierDocumentSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.string(),
  url: z.string(),
  uploadedAt: z.coerce.date(),
})
export type SupplierDocument = z.infer<typeof supplierDocumentSchema>

export const supplierSchema = z.object({
  id: z.string(),
  supplierName: z.string().min(1, 'Supplier name is required'),
  companyType: companyTypeSchema,
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
  email: z.string().email('Invalid email address'),
  phoneNumber: z.string().min(1, 'Phone number is required'),
  address: z.string().min(1, 'Address is required'),
  country: z.string().min(1, 'Country is required'),
  contactPerson: contactPersonSchema,
  capabilities: z.array(capabilitySchema).min(1, 'Select at least one capability'),
  certifications: z.array(certificationSchema),
  yearEstablished: z.number().min(1900).max(new Date().getFullYear()),
  totalWorkers: z.number().min(1, 'Total workers must be at least 1'),
  productionCapacity: z.string().min(1, 'Production capacity is required'),
  leadTime: z.string().min(1, 'Lead time is required'),
  paymentTerms: paymentTermSchema,
  documents: z.array(supplierDocumentSchema),
  status: supplierStatusSchema,
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})
export type Supplier = z.infer<typeof supplierSchema>

export const supplierListSchema = z.array(supplierSchema)

export const supplierFormSchema = supplierSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  status: true,
  documents: true,
})
export type SupplierFormData = z.infer<typeof supplierFormSchema>
