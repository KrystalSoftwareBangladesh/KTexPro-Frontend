import { Details } from '@/features/details'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/details/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Details />
}
