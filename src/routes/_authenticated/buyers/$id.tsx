import { createFileRoute } from '@tanstack/react-router'
import { BuyerDetails } from '@/features/buyers/buyer-details'

export const Route = createFileRoute('/_authenticated/buyers/$id')({
  component: BuyerDetails,
})
