export const buyerStatuses = [
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
  { label: 'Pending', value: 'pending' },
  { label: 'Archived', value: 'archived' },
] as const

export const buyerCategories = [
  { label: 'Retail', value: 'retail' },
  { label: 'Wholesale', value: 'wholesale' },
  { label: 'Distributor', value: 'distributor' },
  { label: 'Direct', value: 'direct' },
] as const

export const orderStatuses = [
  { label: 'Pending', value: 'pending' },
  { label: 'In Production', value: 'in_production' },
  { label: 'Shipped', value: 'shipped' },
  { label: 'Completed', value: 'completed' },
  { label: 'Cancelled', value: 'cancelled' },
] as const

export const paymentTerms = [
  { label: 'Letter of Credit (LC)', value: 'LC' },
  { label: 'Telegraphic Transfer (TT)', value: 'TT' },
  { label: 'Cash on Delivery (COD)', value: 'COD' },
  { label: 'Net 30 Days', value: 'NET30' },
  { label: 'Net 60 Days', value: 'NET60' },
] as const

export const incotermsOptions = [
  { label: 'FOB (Free on Board)', value: 'FOB' },
  { label: 'CIF (Cost, Insurance & Freight)', value: 'CIF' },
  { label: 'EXW (Ex Works)', value: 'EXW' },
  { label: 'DDP (Delivered Duty Paid)', value: 'DDP' },
  { label: 'FCA (Free Carrier)', value: 'FCA' },
] as const

export const complianceCertificates = [
  { label: 'BSCI', value: 'BSCI' },
  { label: 'SEDEX', value: 'SEDEX' },
  { label: 'WRAP', value: 'WRAP' },
  { label: 'GOTS', value: 'GOTS' },
  { label: 'OEKO-TEX', value: 'OEKO-TEX' },
  { label: 'ISO 9001', value: 'ISO9001' },
  { label: 'ISO 14001', value: 'ISO14001' },
] as const

export const communicationTypes = [
  { label: 'Meeting', value: 'meeting' },
  { label: 'Email', value: 'email' },
  { label: 'Call', value: 'call' },
  { label: 'Video Call', value: 'video_call' },
] as const

export const sampleStatuses = [
  { label: 'Pending', value: 'pending' },
  { label: 'In Development', value: 'in_development' },
  { label: 'Sent', value: 'sent' },
  { label: 'Approved', value: 'approved' },
  { label: 'Rejected', value: 'rejected' },
] as const

export const currencies = [
  { label: 'USD', value: 'USD' },
  { label: 'EUR', value: 'EUR' },
  { label: 'GBP', value: 'GBP' },
  { label: 'BDT', value: 'BDT' },
] as const

export const departments = [
  { label: 'Purchasing', value: 'purchasing' },
  { label: 'Quality Control', value: 'quality_control' },
  { label: 'Design', value: 'design' },
  { label: 'Merchandising', value: 'merchandising' },
  { label: 'Finance', value: 'finance' },
] as const
