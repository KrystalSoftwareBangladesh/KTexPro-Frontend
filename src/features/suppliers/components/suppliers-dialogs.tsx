import { SuppliersAddDialog } from './suppliers-add-dialog'
import { SuppliersDeleteDialog } from './suppliers-delete-dialog'
import { SuppliersViewDialog } from './suppliers-view-dialog'
import { useSuppliers } from './suppliers-provider'

export function SuppliersDialogs() {
  const { open } = useSuppliers()

  return (
    <>
      <SuppliersAddDialog key='add-dialog' open={open === 'add'} />
      <SuppliersAddDialog key='edit-dialog' open={open === 'edit'} />
      <SuppliersViewDialog open={open === 'view'} />
      <SuppliersDeleteDialog open={open === 'delete'} />
    </>
  )
}
