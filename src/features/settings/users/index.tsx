import { Button } from '@/components/ui/button'
import { RoleService } from '@/services/role.service'
import { UserService } from '@/services/user.service'
import type { User } from '@/types/auth'
import { useQuery } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import { ContentSection } from '../components/content-section'
import { AssignRoleDialog } from './assign-role-dialog'
import { CreateUserDrawer } from './create-user-dialog'
import { UserViewDialog } from './user-view-dialog'
import { UsersTable } from './users-table'

export function SettingsUsers() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [assigningUser, setAssigningUser] = useState<User | null>(null)
  const [viewingUser, setViewingUser] = useState<User | null>(null)

  const { data: users = [], isLoading, refetch } = useQuery({
    queryKey: ['users'],
    queryFn: () => UserService.getUserList(),
  })

  const { data: roles = [] } = useQuery({
    queryKey: ['roles'],
    queryFn: () => RoleService.getRoles(),
  })
  
  return (
    <>
      <ContentSection
        title='User Management'
        desc='Create and manage users in the system.'
      >
        <div className='flex flex-col gap-4'>
          <div className='flex items-center justify-between'>
            <p className='text-sm text-muted-foreground'>
              {users.length} user(s) in the system
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className='h-4 w-4' />
              Create User
            </Button>
          </div>

          {isLoading ? (
            <div className='text-center py-8 text-muted-foreground'>
              Loading users...
            </div>
          ) : (
            <UsersTable
              data={users}
              roles={roles}
              onViewUser={setViewingUser}
              onAssignRole={setAssigningUser}
            />
          )}
        </div>
      </ContentSection>

      <CreateUserDrawer
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSuccess={() => refetch()}
      />

      {assigningUser && (
        <AssignRoleDialog
          user={assigningUser}
          open={!!assigningUser}
          onOpenChange={(open) => !open && setAssigningUser(null)}
          onSuccess={() => {
            setAssigningUser(null)
            refetch()
          }}
        />
      )}

      {viewingUser && (
        <UserViewDialog
          user={viewingUser}
          open={!!viewingUser}
          onOpenChange={(open) => !open && setViewingUser(null)}
        />
      )}
    </>
  )
}
