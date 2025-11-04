import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useBuyers } from './buyers-provider'

export function BuyersPrimaryButtons() {
  const { setOpen } = useBuyers()

  return (
    <div className='flex items-center gap-2'>
      <Button onClick={() => setOpen('add')} size='sm' className='h-8'>
        <Plus className='size-4' />
        <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>
          Add Buyer
        </span>
      </Button>
    </div>
  )
}
