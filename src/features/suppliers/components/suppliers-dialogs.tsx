import { SuppliersMutateDrawer } from './suppliers-mutate-drawer'
import { SuppliersDeleteDialog } from './suppliers-delete-dialog'
import { SuppliersViewDialog } from './suppliers-view-dialog'
import { useSuppliers } from './suppliers-provider'

export function SuppliersDialogs() {
  const { open, setOpen, currentRow } = useSuppliers()

  return (
    <>
      <SuppliersMutateDrawer
        open={open === 'add' || open === 'edit'}
        onOpenChange={(isOpen) => !isOpen && setOpen(null)}
        currentRow={open === 'edit' ? currentRow || undefined : undefined}
      />
      <SuppliersViewDialog open={open === 'view'} />
      <SuppliersDeleteDialog open={open === 'delete'} />
    </>
  )
}
