import { format } from 'date-fns'
import { Building2, Mail, Phone, Globe, User, Calendar } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
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
          <DialogDescription>{currentRow.company}</DialogDescription>
        </DialogHeader>

        <div className='space-y-4'>
          <div className='flex items-center gap-2'>
            <Badge variant='outline' className='capitalize'>
              {currentRow.status}
            </Badge>
            <Badge variant='secondary' className='capitalize'>
              {currentRow.category}
            </Badge>
          </div>

          <Separator />

          <div className='grid gap-4'>
            <div className='flex items-center gap-3'>
              <Building2 className='size-4 text-muted-foreground' />
              <div>
                <p className='text-sm text-muted-foreground'>Company</p>
                <p className='font-medium'>{currentRow.company}</p>
              </div>
            </div>

            <div className='flex items-center gap-3'>
              <Mail className='size-4 text-muted-foreground' />
              <div>
                <p className='text-sm text-muted-foreground'>Email</p>
                <p className='font-medium'>{currentRow.contactEmail}</p>
              </div>
            </div>

            <div className='flex items-center gap-3'>
              <Phone className='size-4 text-muted-foreground' />
              <div>
                <p className='text-sm text-muted-foreground'>Phone</p>
                <p className='font-medium'>{currentRow.contactPhone}</p>
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
                <p className='text-sm text-muted-foreground'>Key Account Manager</p>
                <p className='font-medium'>{currentRow.keyAccountManager}</p>
              </div>
            </div>

            <div className='flex items-center gap-3'>
              <Calendar className='size-4 text-muted-foreground' />
              <div>
                <p className='text-sm text-muted-foreground'>Relationship Since</p>
                <p className='font-medium'>
                  {format(currentRow.relationshipSince, 'MMMM dd, yyyy')}
                </p>
              </div>
            </div>
          </div>

          {currentRow.notes && (
            <>
              <Separator />
              <div>
                <p className='text-sm text-muted-foreground mb-2'>Notes</p>
                <p className='text-sm'>{currentRow.notes}</p>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
