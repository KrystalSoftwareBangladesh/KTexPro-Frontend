import type { StyleStatus } from '@/types/style'

export const STATUS_LABELS: Record<StyleStatus, string> = {
  draft: 'Draft',
  basic_info_entered: 'Basic Info Entered',
  inquiry_received: 'Inquiry Received',
  technical_details_defined: 'Technical Details Defined',
  sent_to_supplier: 'Sent to Supplier',
  quantity_planned: 'Quantity Planned',
  sample_material_received: 'Sample Material Received',
  sample_cutting_sent: 'Sample Cutting Sent',
  sample_delivery_planned: 'Sample Delivery Planned',
  sample_sent_to_buyer: 'Sample Sent to Buyer',
  awaiting_buyer_feedback: 'Awaiting Buyer Feedback',
  documentation_sent: 'Documentation Sent',
  running: 'Running',
  drop: 'Drop',
  place_with_others: 'Place with Others',
  production_planned: 'Production Planned',
}

export const STATUS_VARIANTS: Record<
  StyleStatus,
  'default' | 'secondary' | 'destructive' | 'outline'
> = {
  draft: 'outline',
  basic_info_entered: 'outline',
  inquiry_received: 'secondary',
  technical_details_defined: 'secondary',
  sent_to_supplier: 'secondary',
  quantity_planned: 'secondary',
  sample_material_received: 'secondary',
  sample_cutting_sent: 'secondary',
  sample_delivery_planned: 'secondary',
  sample_sent_to_buyer: 'default',
  awaiting_buyer_feedback: 'default',
  documentation_sent: 'default',
  running: 'default',
  drop: 'destructive',
  place_with_others: 'outline',
  production_planned: 'default',
}
