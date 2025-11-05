import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import type { Role } from '@/types/auth'

interface RoleViewDialogProps {
  role: Role
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function RoleViewDialog({
  role,
  open,
  onOpenChange,
}: RoleViewDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[600px]'>
        <DialogHeader>
          <DialogTitle>Role Details</DialogTitle>
          <DialogDescription>
            View detailed information about this role and its permissions
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-4'>
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <p className='text-sm font-medium text-muted-foreground'>
                Role Name
              </p>
              <p className='text-sm font-semibold'>{role.name}</p>
            </div>
            <div>
              <p className='text-sm font-medium text-muted-foreground'>
                Role ID
              </p>
              <p className='text-sm font-mono'>{role.id}</p>
            </div>
          </div>

          <div>
            <p className='text-sm font-medium text-muted-foreground mb-2'>
              Permissions ({role.permissions?.length || 0})
            </p>
            {role.permissions && role.permissions.length > 0 ? (
              <div className='grid grid-cols-2 gap-2 max-h-64 overflow-y-auto'>
                {role.permissions.map((permission) => (
                  <div
                    key={permission.id}
                    className='p-3 border rounded-md bg-muted/30'
                  >
                    <Badge variant='secondary' className='mb-1'>
                      {permission.codename}
                    </Badge>
                    <p className='text-xs text-muted-foreground mt-1'>
                      {permission.name}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className='text-sm text-muted-foreground'>
                No permissions assigned to this role
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
