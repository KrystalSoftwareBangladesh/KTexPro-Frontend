import { createFileRoute } from '@tanstack/react-router'
import { SettingsRoles } from '@/features/settings/roles'

export const Route = createFileRoute('/_authenticated/settings/roles')({
  component: SettingsRoles,
})
