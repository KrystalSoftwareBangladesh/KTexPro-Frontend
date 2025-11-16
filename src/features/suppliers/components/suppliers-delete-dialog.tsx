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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useDeleteSupplierMutation } from '../hooks/use-suppliers-query'
import { useSuppliers } from './suppliers-provider'

type SuppliersDeleteDialogProps = {
  open: boolean
}

export function SuppliersDeleteDialog({ open }: SuppliersDeleteDialogProps) {
  const { setOpen, currentRow } = useSuppliers()
  const [confirmText, setConfirmText] = useState('')
  const deleteMutation = useDeleteSupplierMutation()

  const handleDelete = () => {
    if (!currentRow) return
    
    deleteMutation.mutate(parseInt(currentRow.id), {
      onSuccess: () => {
        setOpen(null)
        setConfirmText('')
      },
    })
  }

  return (
    <AlertDialog open={open} onOpenChange={() => setOpen(null)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the supplier{' '}
            <strong>{currentRow?.supplierName}</strong> and remove all associated data
            from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className='space-y-2'>
          <Label htmlFor='confirm'>Type "delete" to confirm</Label>
          <Input
            id='confirm'
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder='delete'
          />
        </div>
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
            disabled={confirmText !== 'delete' || deleteMutation.isPending}
          >
            {deleteMutation.isPending ? 'Deleting...' : 'Delete Supplier'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
