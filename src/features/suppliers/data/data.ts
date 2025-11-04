export const companyTypes = [
  { label: 'Factory', value: 'factory' },
  { label: 'Trader', value: 'trader' },
] as const

export const supplierStatuses = [
  { label: 'Active', value: 'active' },
  { label: 'Pending', value: 'pending' },
  { label: 'Inactive', value: 'inactive' },
  { label: 'Rejected', value: 'rejected' },
] as const

export const capabilities = [
  { label: 'Yarn', value: 'yarn', description: 'Yarn manufacturing and supply' },
  { label: 'Knitting', value: 'knitting', description: 'Fabric knitting services' },
  { label: 'Dyeing', value: 'dyeing', description: 'Fabric dyeing and coloring' },
  { label: 'Sewing', value: 'sewing', description: 'Garment sewing and assembly' },
  { label: 'Printing', value: 'printing', description: 'Fabric and garment printing' },
  { label: 'Embroidery', value: 'embroidery', description: 'Embroidery services' },
  { label: 'Washing', value: 'washing', description: 'Garment washing and finishing' },
  { label: 'Accessories', value: 'accessories', description: 'Buttons, zippers, labels, etc.' },
] as const

export const certificationTypes = [
  { label: 'BSCI', value: 'BSCI', description: 'Business Social Compliance Initiative' },
  { label: 'SEDEX', value: 'SEDEX', description: 'Supplier Ethical Data Exchange' },
  { label: 'WRAP', value: 'WRAP', description: 'Worldwide Responsible Accredited Production' },
  { label: 'GOTS', value: 'GOTS', description: 'Global Organic Textile Standard' },
  { label: 'OEKO-TEX', value: 'OEKO-TEX', description: 'Textile safety certification' },
  { label: 'ISO 9001', value: 'ISO9001', description: 'Quality Management System' },
  { label: 'ISO 14001', value: 'ISO14001', description: 'Environmental Management System' },
  { label: 'SA 8000', value: 'SA8000', description: 'Social Accountability International' },
] as const

export const paymentTerms = [
  { label: 'Letter of Credit (LC)', value: 'LC' },
  { label: 'Telegraphic Transfer (TT)', value: 'TT' },
  { label: 'Net 30 Days', value: 'NET30' },
  { label: 'Net 60 Days', value: 'NET60' },
  { label: 'Cash on Delivery (COD)', value: 'COD' },
] as const

export const countries = [
  'Bangladesh',
  'China',
  'India',
  'Vietnam',
  'Pakistan',
  'Turkey',
  'Indonesia',
  'Cambodia',
  'Sri Lanka',
  'Thailand',
] as const
