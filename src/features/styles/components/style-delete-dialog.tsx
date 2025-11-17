import { Loader2 } from 'lucide-react'
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
import { useDeleteStyle } from '../hooks/use-style-mutations'
import type { Style } from '@/types/style'

interface StyleDeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  style?: Style
  onSuccess?: () => void
}

export function StyleDeleteDialog({
  open,
  onOpenChange,
  style,
  onSuccess,
}: StyleDeleteDialogProps) {
  const deleteMutation = useDeleteStyle()

  const handleDelete = async () => {
    if (!style) return

    try {
      await deleteMutation.mutateAsync(style.id)
      onOpenChange(false)
      onSuccess?.()
    } catch (error) {
      console.error('Error deleting style:', error)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the style{' '}
            <span className='font-semibold'>{style?.styleNumber}</span> ({style?.styleName}
            ). This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteMutation.isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
          >
            {deleteMutation.isPending && (
              <Loader2 className='mr-2 size-4 animate-spin' />
            )}
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
