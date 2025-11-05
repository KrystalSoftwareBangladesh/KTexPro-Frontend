import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ContentSection } from '../components/content-section'
import { UserService } from '@/services/user.service'
import { UserList } from './user-list'
import { CreateUserDialog } from './create-user-dialog'

export function SettingsUsers() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  const { data: users = [], isLoading, refetch } = useQuery({
    queryKey: ['users'],
    queryFn: () => UserService.getUserList(),
  })

  return (
    <>
      <ContentSection
        title='User Management'
        desc='Create and manage users in the system.'
      >
        <div className='space-y-4'>
          <div className='flex items-center justify-between'>
            <p className='text-sm text-muted-foreground'>
              {users.length} user(s) in the system
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className='h-4 w-4' />
              Create User
            </Button>
          </div>

          <UserList users={users} isLoading={isLoading} />
        </div>
      </ContentSection>

      <CreateUserDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSuccess={() => refetch()}
      />
    </>
  )
}
