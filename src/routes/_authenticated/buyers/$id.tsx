import { createFileRoute } from '@tanstack/react-router'
import { BuyerDetailsPage } from '@/features/buyers/buyer-details-page'

export const Route = createFileRoute('/_authenticated/buyers/$id')({
  component: BuyerDetailsPage,
})
