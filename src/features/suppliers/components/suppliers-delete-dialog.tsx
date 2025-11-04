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
import { toast } from 'sonner'
import { useSuppliers } from './suppliers-provider'

type SuppliersDeleteDialogProps = {
  open: boolean
}

export function SuppliersDeleteDialog({ open }: SuppliersDeleteDialogProps) {
  const { setOpen, currentRow } = useSuppliers()
  const [isDeleting, setIsDeleting] = useState(false)
  const [confirmText, setConfirmText] = useState('')

  const handleDelete = () => {
    setIsDeleting(true)
    setTimeout(() => {
      toast.success('Supplier deleted successfully')
      setIsDeleting(false)
      setOpen(null)
      setConfirmText('')
    }, 1000)
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
          <Button variant='outline' onClick={() => setOpen(null)} disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            variant='destructive'
            onClick={handleDelete}
            disabled={confirmText !== 'delete' || isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete Supplier'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
