import { useParams, useNavigate } from '@tanstack/react-router'
import { ArrowLeft, Mail, Phone, Globe, MapPin, Building2, Edit, UserPlus, FileText, MessageSquare, Send, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useBuyerDetails } from './hooks/use-buyer-details'
import { format } from 'date-fns'

export function BuyerDetailsPage() {
  const { id } = useParams({ from: '/_authenticated/buyers/$id' })
  const navigate = useNavigate()
  const { data: buyer, isLoading, isError } = useBuyerDetails(Number(id))

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

  if (isError || !buyer) {
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

  const memberSince = format(new Date(buyer.created_at), 'MMM yyyy')

  // TODO: Replace with real API data when buyer inquiries endpoint is available
  const mockInquiries = [
    {
      id: 1,
      style_id: "Women's Hoodie",
      product_type: "Apparel",
      quantity: 500,
      status: 'pending',
    },
    {
      id: 2,
      style_id: "Sent Holiday Catalog",
      product_type: "Catalog",
      quantity: 0,
      status: 'completed',
    },
  ]

  // TODO: Replace with real API data when buyer communication timeline endpoint is available
  const mockTimeline = [
    {
      id: 1,
      date: '2023-12-15',
      description: 'Status Sampling',
      type: 'note' as const,
    },
    {
      id: 2,
      date: '2022-10-10',
      description: 'Quartely Review Meeting (Video Call)',
      type: 'meeting' as const,
    },
    {
      id: 3,
      date: '2023-11-28',
      description: 'Email - New Collection Inquiry',
      type: 'email' as const,
    },
    {
      id: 4,
      date: '2023-10-01',
      description: 'Sent Holiday Catalog',
      type: 'note' as const,
    },
  ]

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
        <div className='grid gap-6 lg:grid-cols-[1fr_280px]'>
          <div className='space-y-6'>
            <Card className='overflow-hidden'>
              <CardHeader className='bg-muted/50 pb-6'>
                <div className='flex items-start gap-4'>
                  <Avatar className='size-16'>
                    <AvatarFallback className='text-lg'>
                      {buyer.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className='flex-1'>
                    <CardTitle className='text-2xl'>{buyer.name}</CardTitle>
                    <CardDescription className='mt-1'>
                      {buyer.industry} - {buyer.billing_address || 'No location'}
                    </CardDescription>
                    <div className='mt-2 flex items-center gap-3'>
                      <Badge variant='outline' className='text-green-600 border-green-600'>
                        <CheckCircle className='mr-1 size-3' />
                        Active
                      </Badge>
                      <span className='text-sm text-muted-foreground'>
                        Member since {memberSince}
                      </span>
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <div className='grid gap-6 md:grid-cols-2'>
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <Building2 className='size-5' />
                    Company Information
                  </CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div className='space-y-1'>
                    <p className='text-sm text-muted-foreground'>Website</p>
                    {buyer.website ? (
                      <a
                        href={buyer.website}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='flex items-center gap-2 text-primary hover:underline'
                      >
                        <Globe className='size-4' />
                        {buyer.website.replace(/^https?:\/\//, '')}
                      </a>
                    ) : (
                      <p className='text-sm'>-</p>
                    )}
                  </div>

                  <div className='space-y-1'>
                    <p className='text-sm text-muted-foreground'>Email</p>
                    <a
                      href={`mailto:${buyer.email}`}
                      className='flex items-center gap-2 text-primary hover:underline'
                    >
                      <Mail className='size-4' />
                      {buyer.email}
                    </a>
                  </div>

                  <div className='space-y-1'>
                    <p className='text-sm text-muted-foreground'>Phone</p>
                    <a
                      href={`tel:${buyer.phone_number}`}
                      className='flex items-center gap-2 text-primary hover:underline'
                    >
                      <Phone className='size-4' />
                      {buyer.phone_number}
                    </a>
                  </div>

                  <div className='space-y-1'>
                    <p className='text-sm text-muted-foreground'>Billing Address</p>
                    <p className='flex items-start gap-2'>
                      <MapPin className='mt-0.5 size-4 text-muted-foreground' />
                      <span>{buyer.billing_address}</span>
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Inquiries & Styles</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='space-y-3'>
                    {mockInquiries.map((inquiry) => (
                      <div key={inquiry.id} className='flex items-center justify-between rounded-lg border p-3'>
                        <div className='space-y-1'>
                          <p className='text-sm font-medium'>{inquiry.style_id}</p>
                          {inquiry.quantity > 0 && (
                            <p className='text-xs text-muted-foreground'>
                              Qty: {inquiry.quantity}
                            </p>
                          )}
                        </div>
                        {inquiry.status === 'completed' ? (
                          <CheckCircle className='size-4 text-green-600' />
                        ) : (
                          <Clock className='size-4 text-orange-600' />
                        )}
                      </div>
                    ))}
                  </div>
                  <Button variant='link' className='mt-4 w-full'>
                    View All Styles
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className='grid gap-6 md:grid-cols-2'>
              <Card>
                <CardHeader>
                  <div className='flex items-center justify-between'>
                    <CardTitle>Contact Persons</CardTitle>
                    <Button size='sm' variant='outline'>
                      <UserPlus className='mr-2 size-4' />
                      Add New Contact
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {buyer.contact_persons.length === 0 ? (
                    <p className='text-sm text-muted-foreground'>No contact persons</p>
                  ) : (
                    <div className='space-y-3'>
                      {buyer.contact_persons.map((contact) => (
                        <div key={contact.id} className='flex items-start gap-3 rounded-lg border p-3'>
                          <Avatar>
                            <AvatarFallback>
                              {contact.full_name
                                .split(' ')
                                .map((n) => n[0])
                                .join('')
                                .substring(0, 2)
                                .toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className='flex-1 space-y-1'>
                            <p className='font-medium'>{contact.full_name}</p>
                            <p className='text-xs text-muted-foreground'>
                              {contact.username || 'No role'}
                            </p>
                            <div className='flex items-center gap-4 text-xs'>
                              <a
                                href={`mailto:${contact.email}`}
                                className='flex items-center gap-1 text-primary hover:underline'
                              >
                                <Mail className='size-3' />
                              </a>
                              <a href='#' className='flex items-center gap-1 text-primary hover:underline'>
                                <Phone className='size-3' />
                              </a>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Communication Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='space-y-3'>
                    {mockTimeline.slice(0, 4).map((event) => (
                      <div key={event.id} className='flex gap-3'>
                        <div className='flex flex-col items-center'>
                          <div className='flex size-8 items-center justify-center rounded-full bg-muted'>
                            {event.type === 'email' && <Mail className='size-4' />}
                            {event.type === 'meeting' && <AlertCircle className='size-4' />}
                            {event.type === 'note' && <FileText className='size-4' />}
                          </div>
                          <div className='w-px flex-1 bg-border' />
                        </div>
                        <div className='flex-1 pb-3'>
                          <p className='text-sm font-medium'>
                            {format(new Date(event.date), 'MMM dd, yyyy')}
                          </p>
                          <p className='text-sm text-muted-foreground'>{event.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button variant='link' className='mt-2 w-full'>
                    View All Communications
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className='space-y-3'>
            <Button
              variant='outline'
              className='w-full justify-start'
              onClick={() => navigate({ to: '/buyers' })}
            >
              <ArrowLeft className='mr-2 size-4' />
              Back to All Buyers
            </Button>

            <Separator />

            <Button className='w-full justify-start' variant='default'>
              <Edit className='mr-2 size-4' />
              Edit Buyer Info
            </Button>

            <Button className='w-full justify-start' variant='outline'>
              <FileText className='mr-2 size-4' />
              Add New Inquiry
            </Button>

            <Button className='w-full justify-start' variant='outline'>
              <MessageSquare className='mr-2 size-4' />
              Log Communication
            </Button>

            <Button className='w-full justify-start' variant='outline'>
              <Send className='mr-2 size-4' />
              Send Email
            </Button>
          </div>
        </div>
      </Main>
    </>
  )
}
