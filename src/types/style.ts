export type StyleStatus =
  // Phase 1: Inquiry & Initial Setup (Steps 1-3)
  | 'draft' // Step 1: Style Creation
  | 'basic_info_entered' // Step 2: Basic Information Entry
  | 'inquiry_received' // Step 3: Inquiry Received
  // Phase 2: Inquiry Processing (Steps 4-6)
  | 'technical_details_defined' // Step 4: Technical Details Definition
  | 'sent_to_supplier' // Step 5: Send Inquiry to Supplier
  | 'quantity_planned' // Step 6: Quantity Planning
  // Phase 3: Sample Development (Steps 7-11)
  | 'sample_material_received' // Step 7: Sample/Fabric Cutting Received in BD
  | 'sample_cutting_sent' // Step 8: Sample/Fabric Cutting Send to Supplier
  | 'sample_delivery_planned' // Step 9: Sample Delivery Planning
  | 'sample_sent_to_buyer' // Step 10: Sample Sending
  | 'awaiting_buyer_feedback' // Step 11: Sample Comments Received
  // Phase 4: Approval & Production (Steps 12-14)
  | 'documentation_sent' // Step 12: Additional Documentation
  | 'running' // Step 13: Inquiry Status - Running
  | 'drop' // Step 13: Inquiry Status - Drop
  | 'place_with_others' // Step 13: Inquiry Status - Place with Others
  | 'production_planned' // Step 14: Production Planning

export interface Style {
  id: number
  styleNumber: string
  styleName: string
  merchandiserId: number
  supplierId: number
  buyerId: number
  season: string
  brand: string
  department: string
  pictureUrl?: string
  inquiryDates: {
    received?: string
    sentToSupplier?: string
    sampleReceived?: string
    sampleCuttingSent?: string
    sampleSendingDate?: string
    sampleCommentsReceived?: string
  }
  technicalDetails: {
    items: string[]
    garmentType: string
    fabricDetails: string
    colors: string[]
    buyerComments?: string
  }
  quantityPlan: {
    moq?: number
    mcq?: number
    targetPriceFob?: number
    currency?: string
  }
  sampleLog: {
    deliveryRequestDate?: string
    targetDeliveryDate?: string
    sendingDate?: string
  }
  documentation: {
    soSendingDate?: string
    hlSendingDate?: string
    washPanelSendingDate?: string
  }
  productionPlanning?: {
    opdDate?: string
    remarks?: string
  }
  currentStatus: StyleStatus
  statusHistory: Array<{
    status: StyleStatus
    changedAt: string
    changedBy: number
    note?: string
  }>
  buyerSummary?: {
    id: number
    name: string
  }
  supplierSummary?: {
    id: number
    supplierName: string
  }
  merchandiserSummary?: {
    id: number
    fullName: string
  }
  createdAt: string
  updatedAt: string
}

export interface StyleListResponse {
  count: number
  next: string | null
  previous: string | null
  results: Style[]
}

export interface CreateStyleInput {
  styleNumber: string
  styleName: string
  merchandiserId: number
  supplierId: number
  buyerId: number
  season: string
  brand: string
  department: string
  pictureUrl?: string
  inquiryDates?: Partial<Style['inquiryDates']>
  technicalDetails?: Partial<Style['technicalDetails']>
  quantityPlan?: Partial<Style['quantityPlan']>
  currentStatus?: StyleStatus
}

export interface UpdateStyleInput {
  styleNumber?: string
  styleName?: string
  merchandiserId?: number
  supplierId?: number
  buyerId?: number
  season?: string
  brand?: string
  department?: string
  pictureUrl?: string
  inquiryDates?: Partial<Style['inquiryDates']>
  technicalDetails?: Partial<Style['technicalDetails']>
  quantityPlan?: Partial<Style['quantityPlan']>
  sampleLog?: Partial<Style['sampleLog']>
  documentation?: Partial<Style['documentation']>
  productionPlanning?: Partial<Style['productionPlanning']>
}

export interface StyleStatusTransitionInput {
  targetStatus: StyleStatus
  effectiveDate?: string
  notes?: string
}

export interface StyleFilters {
  status?: StyleStatus
  buyerId?: number
  supplierId?: number
  merchandiserId?: number
  season?: string
  search?: string
  page?: number
  pageSize?: number
}
