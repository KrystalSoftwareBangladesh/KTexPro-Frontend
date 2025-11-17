import { createFileRoute } from '@tanstack/react-router'
import { StyleDetailsPage } from '@/features/styles/style-details-page'

export const Route = createFileRoute('/_authenticated/styles/$id')({
  component: StyleDetailsPage,
})
