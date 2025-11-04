import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useSuppliers } from './suppliers-provider'

export function SuppliersPrimaryButtons() {
  const { setOpen, setCurrentRow } = useSuppliers()

  return (
    <div className='flex gap-2'>
      <Button
        onClick={() => {
          setCurrentRow(null)
          setOpen('add')
        }}
      >
        <Plus className='opacity-60' size={18} strokeWidth={2} aria-hidden='true' />
        Add Supplier
      </Button>
    </div>
  )
}
