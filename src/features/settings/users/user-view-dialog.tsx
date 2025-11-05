import { useQuery } from '@tanstack/react-query'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import type { User } from '@/types/auth'
import { RoleService } from '@/services/role.service'

interface UserViewDialogProps {
  user: User
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UserViewDialog({
  user,
  open,
  onOpenChange,
}: UserViewDialogProps) {
  const { data: roles = [] } = useQuery({
    queryKey: ['roles'],
    queryFn: () => RoleService.getRoles(),
  })

  const getRoleName = (roleId: number) => {
    const role = roles.find((r) => r.id === roleId)
    return role?.name || `Role ${roleId}`
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
          <DialogDescription>
            View detailed information about this user
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-4'>
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <p className='text-sm font-medium text-muted-foreground'>
                Username
              </p>
              <p className='text-sm font-semibold'>{user.username}</p>
            </div>
            <div>
              <p className='text-sm font-medium text-muted-foreground'>
                Full Name
              </p>
              <p className='text-sm font-semibold'>
                {user.full_name || 'N/A'}
              </p>
            </div>
          </div>

          <div>
            <p className='text-sm font-medium text-muted-foreground'>Email</p>
            <p className='text-sm font-semibold'>{user.email}</p>
          </div>

          <div>
            <p className='text-sm font-medium text-muted-foreground mb-2'>
              Assigned Roles
            </p>
            {user.groups && user.groups.length > 0 ? (
              <div className='flex flex-wrap gap-2'>
                {user.groups.map((groupId) => (
                  <Badge key={groupId} variant='secondary'>
                    {getRoleName(groupId)}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className='text-sm text-muted-foreground'>
                No roles assigned
              </p>
            )}
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div>
              <p className='text-sm font-medium text-muted-foreground'>
                User ID
              </p>
              <p className='text-sm font-mono'>{user.id}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
