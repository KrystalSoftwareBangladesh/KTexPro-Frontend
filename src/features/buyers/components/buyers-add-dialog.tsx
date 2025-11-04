import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { buyerCategories, buyerStatuses } from '../data/data'
import { useBuyers } from './buyers-provider'

type BuyersAddDialogProps = {
  open: boolean
}

export function BuyersAddDialog({ open }: BuyersAddDialogProps) {
  const { setOpen, currentRow } = useBuyers()
  const [isLoading, setIsLoading] = useState(false)

  const isEdit = !!currentRow

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    setTimeout(() => {
      toast.success(isEdit ? 'Buyer updated successfully' : 'Buyer added successfully')
      setIsLoading(false)
      setOpen(null)
    }, 1000)
  }

  return (
    <Dialog open={open} onOpenChange={() => setOpen(null)}>
      <DialogContent className='sm:max-w-2xl'>
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit' : 'Add'} Buyer</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Update' : 'Add'} buyer information. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className='grid gap-4 py-4'>
            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='name'>Contact Name *</Label>
                <Input
                  id='name'
                  defaultValue={currentRow?.name}
                  placeholder='John Doe'
                  required
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='company'>Company *</Label>
                <Input
                  id='company'
                  defaultValue={currentRow?.company}
                  placeholder='Acme Corp'
                  required
                />
              </div>
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='email'>Email *</Label>
                <Input
                  id='email'
                  type='email'
                  defaultValue={currentRow?.contactEmail}
                  placeholder='john@example.com'
                  required
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='phone'>Phone *</Label>
                <Input
                  id='phone'
                  defaultValue={currentRow?.contactPhone}
                  placeholder='+1 234 567 8900'
                  required
                />
              </div>
            </div>

            <div className='grid grid-cols-3 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='country'>Country *</Label>
                <Input
                  id='country'
                  defaultValue={currentRow?.country}
                  placeholder='United States'
                  required
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='status'>Status *</Label>
                <Select defaultValue={currentRow?.status || 'active'}>
                  <SelectTrigger>
                    <SelectValue placeholder='Select status' />
                  </SelectTrigger>
                  <SelectContent>
                    {buyerStatuses.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className='space-y-2'>
                <Label htmlFor='category'>Category *</Label>
                <Select defaultValue={currentRow?.category || 'retail'}>
                  <SelectTrigger>
                    <SelectValue placeholder='Select category' />
                  </SelectTrigger>
                  <SelectContent>
                    {buyerCategories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='website'>Website</Label>
                <Input
                  id='website'
                  defaultValue={currentRow?.website}
                  placeholder='https://example.com'
                  type='url'
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='manager'>Key Account Manager *</Label>
                <Input
                  id='manager'
                  defaultValue={currentRow?.keyAccountManager}
                  placeholder='Jane Smith'
                  required
                />
              </div>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='notes'>Notes</Label>
              <Textarea
                id='notes'
                defaultValue={currentRow?.notes}
                placeholder='Add any additional notes...'
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type='button'
              variant='outline'
              onClick={() => setOpen(null)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type='submit' disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
