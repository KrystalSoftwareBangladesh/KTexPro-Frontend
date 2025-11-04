import { BuyersAddDialog } from './buyers-add-dialog'
import { BuyersDeleteDialog } from './buyers-delete-dialog'
import { BuyersViewDialog } from './buyers-view-dialog'
import { useBuyers } from './buyers-provider'

export function BuyersDialogs() {
  const { open } = useBuyers()

  return (
    <>
      <BuyersAddDialog key='add-dialog' open={open === 'add'} />
      <BuyersAddDialog key='edit-dialog' open={open === 'edit'} />
      <BuyersViewDialog open={open === 'view'} />
      <BuyersDeleteDialog open={open === 'delete'} />
    </>
  )
}
