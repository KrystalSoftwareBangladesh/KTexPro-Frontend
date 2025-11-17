import { createFileRoute } from '@tanstack/react-router'
import { SupplierDetailsPage } from '@/features/suppliers/supplier-details-page'

export const Route = createFileRoute('/_authenticated/suppliers/$id')({
  component: SupplierDetailsPage,
})
