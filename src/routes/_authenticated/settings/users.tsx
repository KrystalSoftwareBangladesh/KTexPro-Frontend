import { createFileRoute } from '@tanstack/react-router'
import { SettingsUsers } from '@/features/settings/users'

export const Route = createFileRoute('/_authenticated/settings/users')({
  component: SettingsUsers,
})
