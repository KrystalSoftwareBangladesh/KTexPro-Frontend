import { useState } from 'react'
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
import { useBuyers } from './buyers-provider'

type BuyersDeleteDialogProps = {
  open: boolean
}

export function BuyersDeleteDialog({ open }: BuyersDeleteDialogProps) {
  const { setOpen, currentRow } = useBuyers()
  const [isLoading, setIsLoading] = useState(false)

  const handleDelete = async () => {
    setIsLoading(true)

    setTimeout(() => {
      toast.success(`Buyer "${currentRow?.name}" deleted successfully`)
      setIsLoading(false)
      setOpen(null)
    }, 1000)
  }

  return (
    <AlertDialog open={open} onOpenChange={() => setOpen(null)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete <strong>{currentRow?.name}</strong> from{' '}
            <strong>{currentRow?.company}</strong>. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button
            variant='outline'
            onClick={() => setOpen(null)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant='destructive'
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
