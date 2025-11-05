import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { RoleService } from '@/services/role.service'
import type { Role } from '@/types/auth'

interface DeleteRoleDialogProps {
  role: Role
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function DeleteRoleDialog({
  role,
  open,
  onOpenChange,
  onSuccess,
}: DeleteRoleDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const deleteMutation = useMutation({
    mutationFn: () => RoleService.deleteRole(role.id),
    onSuccess: () => {
      toast.success('Role deleted successfully')
      onSuccess()
      onOpenChange(false)
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete role')
    },
    onSettled: () => {
      setIsDeleting(false)
    },
  })

  const handleDelete = () => {
    setIsDeleting(true)
    deleteMutation.mutate()
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the role &quot;{role.name}&quot;. This
            action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
