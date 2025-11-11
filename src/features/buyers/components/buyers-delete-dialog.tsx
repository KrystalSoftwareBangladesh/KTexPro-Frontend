import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { BuyerService } from '@/services/buyer.service'
import { useBuyers } from './buyers-provider'

type BuyersDeleteDialogProps = {
  open: boolean
}

export function BuyersDeleteDialog({ open }: BuyersDeleteDialogProps) {
  const { setOpen, currentRow } = useBuyers()
  const queryClient = useQueryClient()

  const deleteMutation = useMutation({
    mutationFn: (id: number) => BuyerService.deleteBuyer(id),
    onSuccess: () => {
      toast.success(`Buyer "${currentRow?.name}" deleted successfully`)
      queryClient.invalidateQueries({ queryKey: ['buyers'] })
      setOpen(null)
    },
    onError: () => {
      toast.error('Failed to delete buyer')
    },
  })

  const handleDelete = async () => {
    if (currentRow) {
      deleteMutation.mutate(currentRow.id)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={() => setOpen(null)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete <strong>{currentRow?.name}</strong>. This action
            cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button
            variant='outline'
            onClick={() => setOpen(null)}
            disabled={deleteMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            variant='destructive'
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
