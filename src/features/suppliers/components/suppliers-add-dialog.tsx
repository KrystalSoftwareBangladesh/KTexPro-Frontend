import { Dialog, DialogContent } from '@/components/ui/dialog'
import { toast } from 'sonner'
import { SupplierForm } from './supplier-form'
import { useSuppliers } from './suppliers-provider'
import type { SupplierFormData } from '../data/schema'

type SuppliersAddDialogProps = {
  open: boolean
}

export function SuppliersAddDialog({ open }: SuppliersAddDialogProps) {
  const { setOpen, currentRow } = useSuppliers()

  const handleSubmit = (data: SupplierFormData) => {
    toast.success(
      currentRow ? 'Supplier updated successfully' : 'Supplier added successfully'
    )
    setOpen(null)
  }

  return (
    <Dialog open={open} onOpenChange={() => setOpen(null)}>
      <DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto'>
        <SupplierForm
          supplier={currentRow || undefined}
          onSubmit={handleSubmit}
          onCancel={() => setOpen(null)}
        />
      </DialogContent>
    </Dialog>
  )
}
