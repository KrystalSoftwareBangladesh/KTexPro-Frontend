import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ContentSection } from '../components/content-section'
import { RoleService } from '@/services/role.service'
import { RolesTable } from './roles-table'
import { CreateRoleDialog } from './create-role-dialog'
import { EditRoleDialog } from './edit-role-dialog'
import { DeleteRoleDialog } from './delete-role-dialog'
import { RoleViewDialog } from './role-view-dialog'
import type { Role } from '@/types/auth'

export function SettingsRoles() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingRole, setEditingRole] = useState<Role | null>(null)
  const [deletingRole, setDeletingRole] = useState<Role | null>(null)
  const [viewingRole, setViewingRole] = useState<Role | null>(null)

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
        <div className='flex flex-col gap-4'>
          <div className='flex items-center justify-between'>
            <p className='text-sm text-muted-foreground'>
              {roles.length} role(s) in the system
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className='h-4 w-4' />
              Create Role
            </Button>
          </div>

          {isLoading ? (
            <div className='text-center py-8 text-muted-foreground'>
              Loading roles...
            </div>
          ) : (
            <RolesTable
              data={roles}
              onViewRole={setViewingRole}
              onEditRole={setEditingRole}
              onDeleteRole={setDeletingRole}
            />
          )}
        </div>
      </ContentSection>

      <CreateRoleDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSuccess={() => refetch()}
      />

      {editingRole && (
        <EditRoleDialog
          role={editingRole}
          open={!!editingRole}
          onOpenChange={(open) => !open && setEditingRole(null)}
          onSuccess={() => {
            setEditingRole(null)
            refetch()
          }}
        />
      )}

      {deletingRole && (
        <DeleteRoleDialog
          role={deletingRole}
          open={!!deletingRole}
          onOpenChange={(open) => !open && setDeletingRole(null)}
          onSuccess={() => {
            setDeletingRole(null)
            refetch()
          }}
        />
      )}

      {viewingRole && (
        <RoleViewDialog
          role={viewingRole}
          open={!!viewingRole}
          onOpenChange={(open) => !open && setViewingRole(null)}
        />
      )}
    </>
  )
}
