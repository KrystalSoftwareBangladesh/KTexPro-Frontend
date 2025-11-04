import { format } from 'date-fns'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useSuppliers } from './suppliers-provider'

type SuppliersViewDialogProps = {
  open: boolean
}

export function SuppliersViewDialog({ open }: SuppliersViewDialogProps) {
  const { setOpen, currentRow } = useSuppliers()

  if (!currentRow) return null

  return (
    <Dialog open={open} onOpenChange={() => setOpen(null)}>
      <DialogContent className='max-w-3xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>{currentRow.supplierName}</DialogTitle>
          <DialogDescription>Supplier details and information</DialogDescription>
        </DialogHeader>

        <div className='grid gap-6'>
          {/* Basic Information */}
          <div>
            <h4 className='mb-3 text-sm font-semibold'>Basic Information</h4>
            <div className='grid gap-3 sm:grid-cols-2'>
              <div>
                <p className='text-muted-foreground text-sm'>Company Type</p>
                <Badge variant='outline' className='mt-1 capitalize'>
                  {currentRow.companyType}
                </Badge>
              </div>
              <div>
                <p className='text-muted-foreground text-sm'>Status</p>
                <Badge variant='outline' className='mt-1 capitalize'>
                  {currentRow.status}
                </Badge>
              </div>
              <div>
                <p className='text-muted-foreground text-sm'>Email</p>
                <p className='mt-1'>{currentRow.email}</p>
              </div>
              <div>
                <p className='text-muted-foreground text-sm'>Phone</p>
                <p className='mt-1'>{currentRow.phoneNumber}</p>
              </div>
              <div>
                <p className='text-muted-foreground text-sm'>Country</p>
                <p className='mt-1'>{currentRow.country}</p>
              </div>
              <div>
                <p className='text-muted-foreground text-sm'>Website</p>
                <p className='mt-1 truncate'>{currentRow.website || 'N/A'}</p>
              </div>
              <div className='sm:col-span-2'>
                <p className='text-muted-foreground text-sm'>Address</p>
                <p className='mt-1'>{currentRow.address}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Contact Person */}
          <div>
            <h4 className='mb-3 text-sm font-semibold'>Contact Person</h4>
            <div className='grid gap-3 sm:grid-cols-2'>
              <div>
                <p className='text-muted-foreground text-sm'>Full Name</p>
                <p className='mt-1'>{currentRow.contactPerson.fullName}</p>
              </div>
              <div>
                <p className='text-muted-foreground text-sm'>Designation</p>
                <p className='mt-1'>{currentRow.contactPerson.designation}</p>
              </div>
              <div>
                <p className='text-muted-foreground text-sm'>Email</p>
                <p className='mt-1'>{currentRow.contactPerson.email}</p>
              </div>
              <div>
                <p className='text-muted-foreground text-sm'>Phone</p>
                <p className='mt-1'>{currentRow.contactPerson.phone}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Capabilities */}
          <div>
            <h4 className='mb-3 text-sm font-semibold'>Capabilities</h4>
            <div className='flex flex-wrap gap-2'>
              {currentRow.capabilities.map((cap) => (
                <Badge key={cap} variant='secondary' className='capitalize'>
                  {cap}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          {/* Factory Details */}
          <div>
            <h4 className='mb-3 text-sm font-semibold'>Factory Details</h4>
            <div className='grid gap-3 sm:grid-cols-2'>
              <div>
                <p className='text-muted-foreground text-sm'>Year Established</p>
                <p className='mt-1'>{currentRow.yearEstablished}</p>
              </div>
              <div>
                <p className='text-muted-foreground text-sm'>Total Workers</p>
                <p className='mt-1'>{currentRow.totalWorkers.toLocaleString()}</p>
              </div>
              <div>
                <p className='text-muted-foreground text-sm'>Production Capacity</p>
                <p className='mt-1'>{currentRow.productionCapacity}</p>
              </div>
              <div>
                <p className='text-muted-foreground text-sm'>Lead Time</p>
                <p className='mt-1'>{currentRow.leadTime}</p>
              </div>
              <div>
                <p className='text-muted-foreground text-sm'>Payment Terms</p>
                <p className='mt-1'>{currentRow.paymentTerms}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Certifications */}
          <div>
            <h4 className='mb-3 text-sm font-semibold'>
              Certifications ({currentRow.certifications.length})
            </h4>
            <div className='grid gap-3'>
              {currentRow.certifications.map((cert) => (
                <div key={cert.id} className='rounded-lg border p-3'>
                  <div className='flex items-center justify-between'>
                    <Badge>{cert.type}</Badge>
                    <span className='text-muted-foreground text-sm'>
                      {cert.certificateNumber}
                    </span>
                  </div>
                  <div className='text-muted-foreground mt-2 text-sm'>
                    Valid: {format(new Date(cert.issuedDate), 'MMM dd, yyyy')} -{' '}
                    {format(new Date(cert.expiryDate), 'MMM dd, yyyy')}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Metadata */}
          <div className='text-muted-foreground grid gap-2 text-sm'>
            <div>
              <strong>Created:</strong>{' '}
              {format(new Date(currentRow.createdAt), 'MMM dd, yyyy')}
            </div>
            <div>
              <strong>Last Updated:</strong>{' '}
              {format(new Date(currentRow.updatedAt), 'MMM dd, yyyy')}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
