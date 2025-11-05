import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Pencil, Trash2 } from 'lucide-react'
import type { Role } from '@/types/auth'
import { EditRoleDialog } from './edit-role-dialog'
import { DeleteRoleDialog } from './delete-role-dialog'

interface RoleListProps {
  roles: Role[]
  isLoading: boolean
  onUpdate: () => void
}

export function RoleList({ roles, isLoading, onUpdate }: RoleListProps) {
  const [editingRole, setEditingRole] = useState<Role | null>(null)
  const [deletingRole, setDeletingRole] = useState<Role | null>(null)

  if (isLoading) {
    return (
      <div className='space-y-2'>
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className='h-16 w-full' />
        ))}
      </div>
    )
  }

  if (roles.length === 0) {
    return (
      <div className='text-center py-8 text-muted-foreground'>
        No roles found. Create your first role to get started.
      </div>
    )
  }

  return (
    <>
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Role Name</TableHead>
              <TableHead>Permissions</TableHead>
              <TableHead className='text-right'>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {roles.map((role) => (
              <TableRow key={role.id}>
                <TableCell className='font-medium'>{role.name}</TableCell>
                <TableCell>
                  {role.permissions && role.permissions.length > 0 ? (
                    <div className='flex flex-wrap gap-1'>
                      {role.permissions.slice(0, 3).map((permission) => (
                        <Badge key={permission.id} variant='secondary'>
                          {permission.name}
                        </Badge>
                      ))}
                      {role.permissions.length > 3 && (
                        <Badge variant='outline'>
                          +{role.permissions.length - 3} more
                        </Badge>
                      )}
                    </div>
                  ) : (
                    <span className='text-muted-foreground text-sm'>
                      No permissions
                    </span>
                  )}
                </TableCell>
                <TableCell className='text-right'>
                  <div className='flex justify-end gap-2'>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => setEditingRole(role)}
                    >
                      <Pencil className='h-4 w-4' />
                      Edit
                    </Button>
                    <Button
                      variant='destructive'
                      size='sm'
                      onClick={() => setDeletingRole(role)}
                    >
                      <Trash2 className='h-4 w-4' />
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {editingRole && (
        <EditRoleDialog
          role={editingRole}
          open={!!editingRole}
          onOpenChange={(open) => !open && setEditingRole(null)}
          onSuccess={() => {
            setEditingRole(null)
            onUpdate()
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
            onUpdate()
          }}
        />
      )}
    </>
  )
}
