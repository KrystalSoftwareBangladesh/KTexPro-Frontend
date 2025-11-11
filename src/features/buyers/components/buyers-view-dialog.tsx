import { format } from 'date-fns'
import { Building2, Mail, Phone, Globe, User, Calendar } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { useBuyers } from './buyers-provider'

type BuyersViewDialogProps = {
  open: boolean
}

export function BuyersViewDialog({ open }: BuyersViewDialogProps) {
  const { setOpen, currentRow } = useBuyers()

  if (!currentRow) return null

  return (
    <Dialog open={open} onOpenChange={() => setOpen(null)}>
      <DialogContent className='sm:max-w-2xl'>
        <DialogHeader>
          <DialogTitle className='text-2xl'>{currentRow.name}</DialogTitle>
          <DialogDescription>{currentRow.industry}</DialogDescription>
        </DialogHeader>

        <div className='space-y-4'>
          <Separator />

          <div className='grid gap-4'>
            <div className='flex items-center gap-3'>
              <Building2 className='size-4 text-muted-foreground' />
              <div>
                <p className='text-sm text-muted-foreground'>Industry</p>
                <p className='font-medium'>{currentRow.industry}</p>
              </div>
            </div>

            <div className='flex items-center gap-3'>
              <Mail className='size-4 text-muted-foreground' />
              <div>
                <p className='text-sm text-muted-foreground'>Email</p>
                <p className='font-medium'>{currentRow.email}</p>
              </div>
            </div>

            <div className='flex items-center gap-3'>
              <Phone className='size-4 text-muted-foreground' />
              <div>
                <p className='text-sm text-muted-foreground'>Phone</p>
                <p className='font-medium'>{currentRow.phone_number}</p>
              </div>
            </div>

            {currentRow.website && (
              <div className='flex items-center gap-3'>
                <Globe className='size-4 text-muted-foreground' />
                <div>
                  <p className='text-sm text-muted-foreground'>Website</p>
                  <a
                    href={currentRow.website}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='font-medium text-primary hover:underline'
                  >
                    {currentRow.website}
                  </a>
                </div>
              </div>
            )}

            <div className='flex items-center gap-3'>
              <User className='size-4 text-muted-foreground' />
              <div>
                <p className='text-sm text-muted-foreground'>Created By</p>
                <p className='font-medium'>{currentRow.created_by_name}</p>
              </div>
            </div>

            <div className='flex items-center gap-3'>
              <Calendar className='size-4 text-muted-foreground' />
              <div>
                <p className='text-sm text-muted-foreground'>Created At</p>
                <p className='font-medium'>
                  {format(new Date(currentRow.created_at), 'MMMM dd, yyyy')}
                </p>
              </div>
            </div>
          </div>

          {currentRow.billing_address && (
            <>
              <Separator />
              <div>
                <p className='text-sm text-muted-foreground mb-2'>Billing Address</p>
                <p className='text-sm'>{currentRow.billing_address}</p>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
