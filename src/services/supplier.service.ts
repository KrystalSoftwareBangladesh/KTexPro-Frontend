import api from '@/config/api'
import type {
  Supplier,
  SupplierFormData,
  ContactPerson,
  Certification,
  SupplierDocument,
} from '@/features/suppliers/data/schema'

interface SupplierContactPersonApi {
  id?: number
  first_name: string
  last_name: string
  designation?: string
  email: string
  phone?: string
  username?: string
}

interface SupplierCapabilityApi {
  id: number
  name: string
}

interface SupplierCertificationApi {
  id?: number
  type: string
  certificate_number?: string
  issued_date?: string
  expiry_date?: string
  file_url?: string
}

interface SupplierDocumentApi {
  id?: number
  name: string
  type: string
  url: string
  uploaded_at?: string
}

interface SupplierApi {
  id: number
  name: string
  company_type?: 'factory' | 'trader'
  website?: string
  email?: string
  phone_number?: string
  address?: string
  country?: string
  contact_persons: SupplierContactPersonApi[]
  capabilities: number[] | SupplierCapabilityApi[]
  certifications?: SupplierCertificationApi[]
  year_established?: number
  total_workers?: number
  production_capacity?: string
  lead_time?: string
  payment_terms?: string
  minimum_order_quantity?: string
  documents?: SupplierDocumentApi[]
  status?: 'active' | 'pending' | 'inactive' | 'rejected'
  created_at?: string
  updated_at?: string
}

// interface SupplierListResponseApi {
//   count: number
//   next: string | null
//   previous: string | null
//   results: SupplierApi[]
// }

interface SupplierListResponseApi {
  count: number
  next: string | null
  previous: string | null
  data: SupplierApi[]
}


export interface CapabilityType {
  id: number
  name: string
}

function toContactPerson(api: SupplierContactPersonApi): ContactPerson {
  return {
    fullName: `${api.first_name} ${api.last_name}`,
    designation: api.designation || '',
    phone: api.phone || '',
    email: api.email,
  }
}

function fromContactPerson(domain: ContactPerson): {
  first_name: string
  last_name: string
  designation?: string
  email: string
  phone?: string
} {
  const [firstName, ...lastNameParts] = domain.fullName.trim().split(' ')
  return {
    first_name: firstName || '',
    last_name: lastNameParts.join(' ') || firstName || '',
    designation: domain.designation || undefined,
    email: domain.email,
    phone: domain.phone || undefined,
  }
}

function toCertification(api: SupplierCertificationApi): Certification {
  const now = new Date()
  return {
    id: api.id?.toString() || '',
    type: api.type as any,
    certificateNumber: api.certificate_number || '',
    issuedDate: api.issued_date ? new Date(api.issued_date) : now,
    expiryDate: api.expiry_date ? new Date(api.expiry_date) : now,
    fileUrl: api.file_url,
  }
}

function fromCertification(domain: Certification): SupplierCertificationApi {
  return {
    type: domain.type,
    certificate_number: domain.certificateNumber,
    issued_date: domain.issuedDate.toISOString().split('T')[0],
    expiry_date: domain.expiryDate.toISOString().split('T')[0],
    file_url: domain.fileUrl,
  }
}

function toDocument(api: SupplierDocumentApi): SupplierDocument {
  return {
    id: api.id?.toString() || '',
    name: api.name,
    type: api.type,
    url: api.url,
    uploadedAt: api.uploaded_at ? new Date(api.uploaded_at) : new Date(),
  }
}

function toSupplier(api: SupplierApi, capabilityTypes?: CapabilityType[]): Supplier {
  let capabilities: string[] = []
  
  if (Array.isArray(api.capabilities)) {
    capabilities = api.capabilities.map((cap) => {
      if (typeof cap === 'number') {
        const capType = capabilityTypes?.find((ct) => ct.id === cap)
        return capType?.name || `capability-${cap}`
      }
      return cap.name
    })
  }

  const contactPerson =
    api.contact_persons && api.contact_persons.length > 0
      ? toContactPerson(api.contact_persons[0])
      : {
          fullName: '',
          designation: '',
          phone: '',
          email: '',
        }

  return {
    id: api.id.toString(),
    supplierName: api.name,
    companyType: api.company_type || 'factory',
    website: api.website || '',
    email: api.email || '',
    phoneNumber: api.phone_number || '',
    address: api.address || '',
    country: api.country || '',
    contactPerson,
    capabilities: capabilities as any[],
    certifications: (api.certifications || []).map(toCertification),
    yearEstablished: api.year_established || new Date().getFullYear(),
    totalWorkers: api.total_workers || 0,
    productionCapacity: api.production_capacity || '',
    leadTime: api.lead_time || '',
    paymentTerms: (api.payment_terms as any) || 'TT',
    documents: (api.documents || []).map(toDocument),
    status: api.status || 'pending',
    createdAt: api.created_at ? new Date(api.created_at) : new Date(),
    updatedAt: api.updated_at ? new Date(api.updated_at) : new Date(),
    capabilityIds: api.capabilities.map((cap) => 
      typeof cap === 'number' ? cap : cap.id
    ),
  }
}

function fromSupplierForm(domain: SupplierFormData, capabilityIds: number[]) {
  return {
    name: domain.supplierName,
    company_type: domain.companyType,
    website: domain.website || undefined,
    email: domain.email,
    phone_number: domain.phoneNumber,
    address: domain.address,
    country: domain.country,
    contact_persons: [fromContactPerson(domain.contactPerson)],
    capabilities: capabilityIds,
    certifications: domain.certifications.map(fromCertification),
    year_established: domain.yearEstablished,
    total_workers: domain.totalWorkers,
    production_capacity: domain.productionCapacity,
    lead_time: domain.leadTime,
    payment_terms: domain.paymentTerms,
  }
}

export class SupplierService {
  static async getSuppliers(params?: {
    page?: number
    page_size?: number
    search?: string
    status?: string
    country?: string
  }): Promise<{ data: Supplier[]; total: number }> {
    const [response, capabilityTypes] = await Promise.all([
      api.get<SupplierListResponseApi>('/supplier/v1/suppliers', { params }),
      this.getCapabilityTypes(),
    ])
    return {
      data: response.data.map((supplier: SupplierApi) => toSupplier(supplier, capabilityTypes)),
      total: response.length,
    }
  }

  static async getSupplierById(id: number): Promise<Supplier> {
    const [response, capabilityTypes] = await Promise.all([
      api.get<SupplierApi>(`/supplier/v1/suppliers/${id}`),
      this.getCapabilityTypes(),
    ])
    return toSupplier(response.data, capabilityTypes)
  }

  static async createSupplier(
    data: SupplierFormData,
    capabilityIds: number[]
  ): Promise<Supplier> {
    const payload = fromSupplierForm(data, capabilityIds)
    const response = await api.post<SupplierApi>('/supplier/v1/suppliers/', payload)
    const capabilityTypes = await this.getCapabilityTypes()
    return toSupplier(response.data, capabilityTypes)
  }

  static async updateSupplier(
    id: number,
    data: Partial<SupplierFormData>,
    capabilityIds?: number[]
  ): Promise<Supplier> {
    const payload: any = {}

    if (data.supplierName !== undefined) payload.name = data.supplierName
    if (data.companyType !== undefined) payload.company_type = data.companyType
    if (data.website !== undefined) payload.website = data.website || undefined
    if (data.email !== undefined) payload.email = data.email
    if (data.phoneNumber !== undefined) payload.phone_number = data.phoneNumber
    if (data.address !== undefined) payload.address = data.address
    if (data.country !== undefined) payload.country = data.country
    if (data.contactPerson !== undefined) {
      payload.contact_persons = [fromContactPerson(data.contactPerson)]
    }
    if (capabilityIds !== undefined) payload.capabilities = capabilityIds
    if (data.certifications !== undefined) {
      payload.certifications = data.certifications.map(fromCertification)
    }
    if (data.yearEstablished !== undefined) payload.year_established = data.yearEstablished
    if (data.totalWorkers !== undefined) payload.total_workers = data.totalWorkers
    if (data.productionCapacity !== undefined) {
      payload.production_capacity = data.productionCapacity
    }
    if (data.leadTime !== undefined) payload.lead_time = data.leadTime
    if (data.paymentTerms !== undefined) payload.payment_terms = data.paymentTerms

    const response = await api.patch<SupplierApi>(`/supplier/v1/suppliers/${id}/`, payload)
    const capabilityTypes = await this.getCapabilityTypes()
    return toSupplier(response.data, capabilityTypes)
  }

  static async deleteSupplier(id: number): Promise<void> {
    await api.delete(`/supplier/v1/suppliers/${id}/`)
  }

  static async getCapabilityTypes(): Promise<CapabilityType[]> {
    const response = await api.get<CapabilityType[]>('/supplier/v1/capability-types')
    return response.data
  }

  static async createCapabilityType(name: string): Promise<CapabilityType> {
    const response = await api.post<CapabilityType>('/supplier/v1/capability-types/', {
      name,
    })
    return response.data
  }

  static async updateCapabilityType(id: number, name: string): Promise<CapabilityType> {
    const response = await api.patch<CapabilityType>(
      `/supplier/v1/capability-types/${id}/`,
      { name }
    )
    return response.data
  }

  static async deleteCapabilityType(id: number): Promise<void> {
    await api.delete(`/supplier/v1/capability-types/${id}/`)
  }

  static async uploadDocument(file: File): Promise<{ url: string }> {
    const formData = new FormData()
    formData.append('file', file)
    const response = await api.post('/supplier/v1/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  }
}
