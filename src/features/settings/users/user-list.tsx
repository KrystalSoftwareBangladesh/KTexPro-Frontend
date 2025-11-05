import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import type { User } from '@/types/auth'

interface UserListProps {
  users: User[]
  isLoading: boolean
}

export function UserList({ users, isLoading }: UserListProps) {
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
    <div className='rounded-md border'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Username</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Roles</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className='font-medium'>{user.username}</TableCell>
              <TableCell>
                {[user.first_name, user.middle_name, user.last_name]
                  .filter(Boolean)
                  .join(' ')}
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                {user.roles && user.roles.length > 0 ? (
                  <div className='flex gap-1'>
                    {user.roles.map((role) => (
                      <Badge key={role} variant='secondary'>
                        {role}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <span className='text-muted-foreground text-sm'>No roles</span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
