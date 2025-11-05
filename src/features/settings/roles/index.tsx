import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ContentSection } from '../components/content-section'
import { RoleService } from '@/services/role.service'
import { RoleList } from './role-list'
import { CreateRoleDialog } from './create-role-dialog'

export function SettingsRoles() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  const {
    data: roles = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['roles'],
    queryFn: () => RoleService.getRoles(),
  })

  return (
    <>
      <ContentSection
        title='Role Management'
        desc='Create and manage roles with permissions.'
      >
        <div className='space-y-4'>
          <div className='flex items-center justify-between'>
            <p className='text-sm text-muted-foreground'>
              {roles.length} role(s) in the system
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className='h-4 w-4' />
              Create Role
            </Button>
          </div>

          <RoleList roles={roles} isLoading={isLoading} onUpdate={refetch} />
        </div>
      </ContentSection>

      <CreateRoleDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSuccess={() => refetch()}
      />
    </>
  )
}
