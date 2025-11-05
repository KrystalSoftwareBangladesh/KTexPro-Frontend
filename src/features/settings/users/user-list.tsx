import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { UserCog } from 'lucide-react'
import type { User } from '@/types/auth'
import { AssignRoleDialog } from './assign-role-dialog'

interface UserListProps {
  users: User[]
  isLoading: boolean
  onUpdate: () => void
}

export function UserList({ users, isLoading, onUpdate }: UserListProps) {
  const [assigningUser, setAssigningUser] = useState<User | null>(null)
  if (isLoading) {
    return (
      <div className='space-y-2'>
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className='h-16 w-full' />
        ))}
      </div>
    )
  }

  if (users.length === 0) {
    return (
      <div className='text-center py-8 text-muted-foreground'>
        No users found. Create your first user to get started.
      </div>
    )
  }

  return (
    <>
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Username</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Groups</TableHead>
              <TableHead className='text-right'>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className='font-medium'>{user.username}</TableCell>
                <TableCell>{user.full_name || '-'}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  {user.groups && user.groups.length > 0 ? (
                    <div className='flex gap-1'>
                      {user.groups.map((groupId) => (
                        <Badge key={groupId} variant='secondary'>
                          Group {groupId}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <span className='text-muted-foreground text-sm'>
                      No groups assigned
                    </span>
                  )}
                </TableCell>
                <TableCell className='text-right'>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => setAssigningUser(user)}
                  >
                    <UserCog className='h-4 w-4' />
                    Assign Roles
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {assigningUser && (
        <AssignRoleDialog
          user={assigningUser}
          open={!!assigningUser}
          onOpenChange={(open) => !open && setAssigningUser(null)}
          onSuccess={() => {
            setAssigningUser(null)
            onUpdate()
          }}
        />
      )}
    </>
  )
}
