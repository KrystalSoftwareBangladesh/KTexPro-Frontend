import { createFileRoute } from '@tanstack/react-router'
import { CapabilitiesPage } from '@/features/suppliers/pages/capabilities-page'

export const Route = createFileRoute('/_authenticated/suppliers/capabilities')({
  component: CapabilitiesPage,
})
