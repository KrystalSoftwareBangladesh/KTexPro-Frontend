import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useParams } from '@tanstack/react-router'
import { ArrowLeft, Mail, Phone, Globe, MapPin, Building2, Calendar, User, Edit, Trash2, UserPlus } from 'lucide-react'
import { toast } from 'sonner'
import { useState } from 'react'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { BuyerService } from '@/services/buyer.service'
import { format } from 'date-fns'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

export function BuyerDetails() {
  const { id } = useParams({ from: '/_authenticated/buyers/$id' })
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const { data: buyer, isLoading } = useQuery({
    queryKey: ['buyer', id],
    queryFn: () => BuyerService.getBuyerById(Number(id)),
  })

  const deleteMutation = useMutation({
    mutationFn: () => BuyerService.deleteBuyer(Number(id)),
    onSuccess: () => {
      toast.success('Buyer deleted successfully')
      queryClient.invalidateQueries({ queryKey: ['buyers'] })
      navigate({ to: '/buyers' })
    },
    onError: () => {
      toast.error('Failed to delete buyer')
    },
  })

  const handleDelete = () => {
    deleteMutation.mutate()
    setShowDeleteDialog(false)
  }

  if (isLoading) {
    return (
      <>
        <Header fixed>
          <Search />
          <div className='ms-auto flex items-center space-x-4'>
            <ThemeSwitch />
            <ConfigDrawer />
            <ProfileDropdown />
          </div>
        </Header>
        <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
          <div className='flex items-center justify-center py-10'>
            <p className='text-muted-foreground'>Loading buyer details...</p>
          </div>
        </Main>
      </>
    )
  }

  if (!buyer) {
    return (
      <>
        <Header fixed>
          <Search />
          <div className='ms-auto flex items-center space-x-4'>
            <ThemeSwitch />
            <ConfigDrawer />
            <ProfileDropdown />
          </div>
        </Header>
        <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
          <div className='flex items-center justify-center py-10'>
            <p className='text-muted-foreground'>Buyer not found</p>
          </div>
        </Main>
      </>
    )
  }

  return (
    <>
      <Header fixed>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex items-center gap-4'>
          <Button
            variant='outline'
            size='icon'
            onClick={() => navigate({ to: '/buyers' })}
          >
            <ArrowLeft className='size-4' />
          </Button>
          <div className='flex-1'>
            <h2 className='text-2xl font-bold tracking-tight'>{buyer.name}</h2>
            <p className='text-muted-foreground'>{buyer.industry}</p>
          </div>
          <div className='flex gap-2'>
            <Button variant='outline' size='sm'>
              <Edit className='mr-2 size-4' />
              Edit
            </Button>
            <Button
              variant='outline'
              size='sm'
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash2 className='mr-2 size-4' />
              Delete
            </Button>
          </div>
        </div>

        <div className='grid gap-4 md:grid-cols-2'>
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
              <CardDescription>Basic details about the buyer</CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex items-start gap-3'>
                <Building2 className='mt-0.5 size-4 text-muted-foreground' />
                <div className='flex-1'>
                  <p className='text-sm text-muted-foreground'>Company Name</p>
                  <p className='font-medium'>{buyer.name}</p>
                </div>
              </div>

              <div className='flex items-start gap-3'>
                <Mail className='mt-0.5 size-4 text-muted-foreground' />
                <div className='flex-1'>
                  <p className='text-sm text-muted-foreground'>Email</p>
                  <a
                    href={`mailto:${buyer.email}`}
                    className='font-medium text-primary hover:underline'
                  >
                    {buyer.email}
                  </a>
                </div>
              </div>

              <div className='flex items-start gap-3'>
                <Phone className='mt-0.5 size-4 text-muted-foreground' />
                <div className='flex-1'>
                  <p className='text-sm text-muted-foreground'>Phone</p>
                  <a
                    href={`tel:${buyer.phone_number}`}
                    className='font-medium text-primary hover:underline'
                  >
                    {buyer.phone_number}
                  </a>
                </div>
              </div>

              {buyer.website && (
                <div className='flex items-start gap-3'>
                  <Globe className='mt-0.5 size-4 text-muted-foreground' />
                  <div className='flex-1'>
                    <p className='text-sm text-muted-foreground'>Website</p>
                    <a
                      href={buyer.website}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='font-medium text-primary hover:underline'
                    >
                      {buyer.website}
                    </a>
                  </div>
                </div>
              )}

              <div className='flex items-start gap-3'>
                <MapPin className='mt-0.5 size-4 text-muted-foreground' />
                <div className='flex-1'>
                  <p className='text-sm text-muted-foreground'>Billing Address</p>
                  <p className='font-medium'>{buyer.billing_address}</p>
                </div>
              </div>

              <Separator />

              <div className='flex items-start gap-3'>
                <User className='mt-0.5 size-4 text-muted-foreground' />
                <div className='flex-1'>
                  <p className='text-sm text-muted-foreground'>Created By</p>
                  <p className='font-medium'>{buyer.created_by_name}</p>
                </div>
              </div>

              <div className='flex items-start gap-3'>
                <Calendar className='mt-0.5 size-4 text-muted-foreground' />
                <div className='flex-1'>
                  <p className='text-sm text-muted-foreground'>Created At</p>
                  <p className='font-medium'>
                    {format(new Date(buyer.created_at), 'PPP')}
                  </p>
                </div>
              </div>

              {buyer.updated_by_name && (
                <div className='flex items-start gap-3'>
                  <User className='mt-0.5 size-4 text-muted-foreground' />
                  <div className='flex-1'>
                    <p className='text-sm text-muted-foreground'>Last Updated By</p>
                    <p className='font-medium'>{buyer.updated_by_name}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <div>
                  <CardTitle>Contact Persons</CardTitle>
                  <CardDescription>
                    {buyer.contact_persons.length} contact person(s)
                  </CardDescription>
                </div>
                <Button size='sm' variant='outline'>
                  <UserPlus className='mr-2 size-4' />
                  Add Contact
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {buyer.contact_persons.length === 0 ? (
                <p className='text-sm text-muted-foreground'>No contact persons added yet</p>
              ) : (
                <div className='space-y-4'>
                  {buyer.contact_persons.map((contact) => (
                    <div key={contact.id} className='rounded-lg border p-4'>
                      <div className='mb-2 flex items-start justify-between'>
                        <div>
                          <p className='font-medium'>{contact.full_name}</p>
                          <p className='text-sm text-muted-foreground'>
                            @{contact.username}
                          </p>
                        </div>
                        {contact.groups.length > 0 && (
                          <Badge variant='secondary'>{contact.groups.length} groups</Badge>
                        )}
                      </div>
                      <div className='space-y-2 text-sm'>
                        <div className='flex items-center gap-2'>
                          <Mail className='size-3 text-muted-foreground' />
                          <a
                            href={`mailto:${contact.email}`}
                            className='text-primary hover:underline'
                          >
                            {contact.email}
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </Main>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete <strong>{buyer.name}</strong>. This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
