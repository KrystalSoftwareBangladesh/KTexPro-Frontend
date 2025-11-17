import { createFileRoute } from '@tanstack/react-router'
import { StylesPage } from '@/features/styles'

export const Route = createFileRoute('/_authenticated/styles/')({
  component: StylesPage,
})
