import type {
  CreateStyleInput,
  Style,
  StyleFilters,
  StyleListResponse,
  StyleStatusTransitionInput,
  UpdateStyleInput,
} from '@/types/style'
import { BuyerService } from './buyer.service'
import { SupplierService } from './supplier.service'

const STORAGE_KEY = 'mock_styles_data'
const SEED_DATA_KEY = 'mock_styles_seeded'

let mockId = 1
let buyersCache: any[] = []
let suppliersCache: any[] = []

const FALLBACK_BUYERS = [
  { id: 1, name: 'Buyer Company A' },
  { id: 2, name: 'Buyer Company B' },
  { id: 3, name: 'Buyer Company C' },
]

const FALLBACK_SUPPLIERS = [
  { id: 1, supplierName: 'Supplier Factory A' },
  { id: 2, supplierName: 'Supplier Factory B' },
  { id: 3, supplierName: 'Supplier Factory C' },
]

async function loadBuyersAndSuppliers() {
  if (buyersCache.length > 0 && suppliersCache.length > 0) {
    return
  }
  
  try {
    if (buyersCache.length === 0) {
      const buyers = await Promise.race([
        BuyerService.getBuyers(),
        new Promise<any[]>((_, reject) => setTimeout(() => reject(new Error('timeout')), 2000))
      ])
      buyersCache = buyers && buyers.length > 0 ? buyers : FALLBACK_BUYERS
    }
  } catch {
    buyersCache = FALLBACK_BUYERS
  }
  
  try {
    if (suppliersCache.length === 0) {
      const response = await Promise.race([
        SupplierService.getSuppliers({}),
        new Promise<any>((_, reject) => setTimeout(() => reject(new Error('timeout')), 2000))
      ])
      suppliersCache = response?.data && response.data.length > 0 ? response.data : FALLBACK_SUPPLIERS
    }
  } catch {
    suppliersCache = FALLBACK_SUPPLIERS
  }
}

function getBuyerSummary(buyerId: number) {
  const buyer = buyersCache.find(b => b.id === buyerId)
  return buyer ? { id: buyer.id, name: buyer.name } : { id: buyerId, name: `Buyer #${buyerId}` }
}

function getSupplierSummary(supplierId: number) {
  const supplier = suppliersCache.find(s => s.id === supplierId)
  return supplier ? { id: supplier.id, supplierName: supplier.supplierName } : { id: supplierId, supplierName: `Supplier #${supplierId}` }
}

function getStoredStyles(): Style[] {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) return []
  try {
    const data = JSON.parse(stored)
    if (Array.isArray(data) && data.length > 0) {
      mockId = Math.max(...data.map((s: Style) => s.id), 0) + 1
      return data
    }
    return []
  } catch {
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem(SEED_DATA_KEY)
    return []
  }
}

function saveStyles(styles: Style[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(styles))
}

async function seedInitialData(): Promise<void> {
  const stored = getStoredStyles()
  if (stored.length > 0) return
  
  const seeded = localStorage.getItem(SEED_DATA_KEY)
  if (seeded) return
  
  await loadBuyersAndSuppliers()
  
  const seedStyles: Style[] = [
    {
      id: 1,
      styleNumber: 'STY-2024-001',
      styleName: 'Summer Casual Shirt',
      merchandiserId: 1,
      supplierId: suppliersCache[0]?.id || 1,
      buyerId: buyersCache[0]?.id || 1,
      season: 'Summer 2024',
      brand: 'Brand A',
      department: 'Menswear',
      inquiryDates: {},
      technicalDetails: {
        items: ['Shirt'],
        garmentType: 'Casual Shirt',
        fabricDetails: '100% Cotton',
        colors: ['Blue', 'White', 'Gray'],
      },
      quantityPlan: {
        moq: 1000,
        targetPriceFob: 15.50,
        currency: 'USD',
      },
      sampleLog: {},
      documentation: {},
      productionPlanning: {},
      currentStatus: 'inquiry_received',
      statusHistory: [
        {
          status: 'draft',
          changedAt: new Date('2024-01-01').toISOString(),
          changedBy: 1,
          note: 'Style created',
        },
        {
          status: 'inquiry_received',
          changedAt: new Date('2024-01-05').toISOString(),
          changedBy: 1,
          note: 'Inquiry received from buyer',
        },
      ],
      createdAt: new Date('2024-01-01').toISOString(),
      updatedAt: new Date('2024-01-05').toISOString(),
      buyerSummary: getBuyerSummary(buyersCache[0]?.id || 1),
      supplierSummary: getSupplierSummary(suppliersCache[0]?.id || 1),
    },
    {
      id: 2,
      styleNumber: 'STY-2024-002',
      styleName: 'Winter Jacket',
      merchandiserId: 1,
      supplierId: suppliersCache[0]?.id || 1,
      buyerId: buyersCache[0]?.id || 1,
      season: 'Winter 2024',
      brand: 'Brand B',
      department: 'Outerwear',
      inquiryDates: {},
      technicalDetails: {
        items: ['Jacket'],
        garmentType: 'Puffer Jacket',
        fabricDetails: 'Polyester Shell with Down Fill',
        colors: ['Black', 'Navy'],
      },
      quantityPlan: {
        moq: 500,
        targetPriceFob: 45.00,
        currency: 'USD',
      },
      sampleLog: {},
      documentation: {},
      productionPlanning: {},
      currentStatus: 'sample_sent_to_buyer',
      statusHistory: [
        {
          status: 'draft',
          changedAt: new Date('2024-02-01').toISOString(),
          changedBy: 1,
          note: 'Style created',
        },
        {
          status: 'sample_sent_to_buyer',
          changedAt: new Date('2024-02-15').toISOString(),
          changedBy: 1,
          note: 'Sample sent for approval',
        },
      ],
      createdAt: new Date('2024-02-01').toISOString(),
      updatedAt: new Date('2024-02-15').toISOString(),
      buyerSummary: getBuyerSummary(buyersCache[0]?.id || 1),
      supplierSummary: getSupplierSummary(suppliersCache[0]?.id || 1),
    },
  ]
  
  mockId = 3
  saveStyles(seedStyles)
  localStorage.setItem(SEED_DATA_KEY, 'true')
}

export const mockStyleService = {
  getStyles: async (filters?: StyleFilters): Promise<StyleListResponse> => {
    await loadBuyersAndSuppliers()
    await seedInitialData()
    await new Promise((resolve) => setTimeout(resolve, 300))
    
    let styles = getStoredStyles()

    if (filters?.status) {
      styles = styles.filter((s) => s.currentStatus === filters.status)
    }
    if (filters?.buyerId) {
      styles = styles.filter((s) => s.buyerId === filters.buyerId)
    }
    if (filters?.supplierId) {
      styles = styles.filter((s) => s.supplierId === filters.supplierId)
    }
    if (filters?.merchandiserId) {
      styles = styles.filter((s) => s.merchandiserId === filters.merchandiserId)
    }
    if (filters?.season) {
      styles = styles.filter((s) => s.season.toLowerCase().includes(filters.season!.toLowerCase()))
    }
    if (filters?.search) {
      const search = filters.search.toLowerCase()
      styles = styles.filter(
        (s) =>
          s.styleNumber.toLowerCase().includes(search) ||
          s.styleName.toLowerCase().includes(search)
      )
    }

    const page = filters?.page || 1
    const pageSize = filters?.pageSize || 10
    const start = (page - 1) * pageSize
    const end = start + pageSize

    return {
      count: styles.length,
      next: end < styles.length ? `page=${page + 1}` : null,
      previous: page > 1 ? `page=${page - 1}` : null,
      results: styles.slice(start, end),
    }
  },

  getStyleById: async (id: number): Promise<Style> => {
    await loadBuyersAndSuppliers()
    await seedInitialData()
    await new Promise((resolve) => setTimeout(resolve, 200))
    
    const styles = getStoredStyles()
    const style = styles.find((s) => s.id === id)
    
    if (!style) {
      throw new Error('Style not found')
    }
    
    return style
  },

  createStyle: async (data: CreateStyleInput): Promise<Style> => {
    await loadBuyersAndSuppliers()
    await new Promise((resolve) => setTimeout(resolve, 500))
    
    const styles = getStoredStyles()
    
    const newStyle: Style = {
      id: mockId++,
      styleNumber: data.styleNumber,
      styleName: data.styleName,
      merchandiserId: data.merchandiserId,
      supplierId: data.supplierId,
      buyerId: data.buyerId,
      season: data.season,
      brand: data.brand,
      department: data.department,
      pictureUrl: data.pictureUrl,
      inquiryDates: data.inquiryDates || {},
      technicalDetails: {
        items: data.technicalDetails?.items || [],
        garmentType: data.technicalDetails?.garmentType || '',
        fabricDetails: data.technicalDetails?.fabricDetails || '',
        colors: data.technicalDetails?.colors || [],
        buyerComments: data.technicalDetails?.buyerComments,
      },
      quantityPlan: data.quantityPlan || {},
      sampleLog: {},
      documentation: {},
      productionPlanning: {},
      currentStatus: data.currentStatus || 'draft',
      statusHistory: [
        {
          status: data.currentStatus || 'draft',
          changedAt: new Date().toISOString(),
          changedBy: data.merchandiserId,
          note: 'Style created',
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      buyerSummary: getBuyerSummary(data.buyerId),
      supplierSummary: getSupplierSummary(data.supplierId),
    }
    
    styles.push(newStyle)
    saveStyles(styles)
    
    return newStyle
  },

  updateStyle: async (id: number, data: UpdateStyleInput): Promise<Style> => {
    await loadBuyersAndSuppliers()
    await new Promise((resolve) => setTimeout(resolve, 500))
    
    const styles = getStoredStyles()
    const index = styles.findIndex((s) => s.id === id)
    
    if (index === -1) {
      throw new Error('Style not found')
    }
    
    const updatedStyle: Style = {
      ...styles[index],
      ...data,
      technicalDetails: data.technicalDetails ? {
        items: data.technicalDetails.items || styles[index].technicalDetails.items,
        garmentType: data.technicalDetails.garmentType || styles[index].technicalDetails.garmentType,
        fabricDetails: data.technicalDetails.fabricDetails || styles[index].technicalDetails.fabricDetails,
        colors: data.technicalDetails.colors || styles[index].technicalDetails.colors,
        buyerComments: data.technicalDetails.buyerComments || styles[index].technicalDetails.buyerComments,
      } : styles[index].technicalDetails,
      buyerSummary: data.buyerId ? getBuyerSummary(data.buyerId) : styles[index].buyerSummary,
      supplierSummary: data.supplierId ? getSupplierSummary(data.supplierId) : styles[index].supplierSummary,
      updatedAt: new Date().toISOString(),
    }
    
    styles[index] = updatedStyle
    saveStyles(styles)
    
    return updatedStyle
  },

  deleteStyle: async (id: number): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 300))
    
    const styles = getStoredStyles()
    const filtered = styles.filter((s) => s.id !== id)
    
    if (filtered.length === styles.length) {
      throw new Error('Style not found')
    }
    
    saveStyles(filtered)
  },

  transitionStatus: async (
    id: number,
    data: StyleStatusTransitionInput
  ): Promise<Style> => {
    await new Promise((resolve) => setTimeout(resolve, 400))
    
    const styles = getStoredStyles()
    const index = styles.findIndex((s) => s.id === id)
    
    if (index === -1) {
      throw new Error('Style not found')
    }
    
    const updatedStyle: Style = {
      ...styles[index],
      currentStatus: data.targetStatus,
      statusHistory: [
        ...styles[index].statusHistory,
        {
          status: data.targetStatus,
          changedAt: data.effectiveDate || new Date().toISOString(),
          changedBy: styles[index].merchandiserId,
          note: data.notes,
        },
      ],
      updatedAt: new Date().toISOString(),
    }
    
    styles[index] = updatedStyle
    saveStyles(styles)
    
    return updatedStyle
  },

  getTimeline: async (id: number): Promise<Style['statusHistory']> => {
    await new Promise((resolve) => setTimeout(resolve, 200))
    
    const styles = getStoredStyles()
    const style = styles.find((s) => s.id === id)
    
    if (!style) {
      throw new Error('Style not found')
    }
    
    return style.statusHistory
  },
}
