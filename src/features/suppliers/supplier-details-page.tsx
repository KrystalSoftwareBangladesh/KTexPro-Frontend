import { useParams, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { ArrowLeft, Globe, Mail, Phone, MapPin, Calendar, Users, Package, Edit, MoreVertical } from 'lucide-react'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useSupplierDetails } from './hooks/use-supplier-details'
import { format } from 'date-fns'

export function SupplierDetailsPage() {
  const { id } = useParams({ from: '/_authenticated/suppliers/$id' })
  const navigate = useNavigate()
  const { data: supplier, isLoading, isError } = useSupplierDetails(Number(id))
  const [activeTab, setActiveTab] = useState('overview')

  // TODO: Replace with real API data when supplier activity endpoint is available
  const mockRecentActivity = [
    'Application Approved',
    'First Order Placed',
    'Document Updated',
    'Download Data',
    'Dossitent',
  ]

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
            <p className='text-muted-foreground'>Loading supplier details...</p>
          </div>
        </Main>
      </>
    )
  }

  if (isError || !supplier) {
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
            <p className='text-muted-foreground'>Supplier not found</p>
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
            onClick={() => navigate({ to: '/suppliers' })}
          >
            <ArrowLeft className='size-4' />
          </Button>
          <div className='flex-1'>
            <div className='flex items-center gap-3'>
              <h2 className='text-3xl font-bold tracking-tight'>{supplier.supplierName}</h2>
              <Badge variant={supplier.status === 'active' ? 'default' : 'secondary'} className='bg-green-600'>
                {supplier.status === 'active' ? 'Approved' : supplier.status}
              </Badge>
            </div>
          </div>
          <div className='flex gap-2'>
            <Button variant='outline'>
              <Edit className='mr-2 size-4' />
              Edit Supplier
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='outline' size='icon'>
                  <MoreVertical className='size-4' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end'>
                <DropdownMenuItem>View Documents</DropdownMenuItem>
                <DropdownMenuItem>Export Data</DropdownMenuItem>
                <DropdownMenuItem>Send Email</DropdownMenuItem>
                <DropdownMenuItem className='text-destructive'>Delete Supplier</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className='w-full'>
          <TabsList className='grid w-full grid-cols-7'>
            <TabsTrigger value='overview'>Overview</TabsTrigger>
            <TabsTrigger value='contacts'>Contacts</TabsTrigger>
            <TabsTrigger value='capabilities'>Capabilities</TabsTrigger>
            <TabsTrigger value='certifications'>Certifications</TabsTrigger>
            <TabsTrigger value='documents'>Documents</TabsTrigger>
            <TabsTrigger value='orders'>Orders & Production</TabsTrigger>
            <TabsTrigger value='performance'>Performance</TabsTrigger>
          </TabsList>

          <TabsContent value='overview' className='mt-6'>
            <div className='grid gap-6 lg:grid-cols-[1fr_300px]'>
              <div className='space-y-6'>
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                    <CardDescription>Supplier details and company information</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className='grid gap-6 md:grid-cols-2'>
                      <div className='space-y-4'>
                        <div>
                          <label className='text-sm font-medium'>Supplier Name</label>
                          <p className='mt-1 text-primary'>{supplier.supplierName}</p>
                        </div>

                        <div>
                          <label className='text-sm font-medium'>Website</label>
                          {supplier.website ? (
                            <a
                              href={supplier.website}
                              target='_blank'
                              rel='noopener noreferrer'
                              className='mt-1 flex items-center gap-2 text-primary hover:underline'
                            >
                              <Globe className='size-4' />
                              {supplier.website.replace(/^https?:\/\//, '')}
                            </a>
                          ) : (
                            <p className='mt-1 text-muted-foreground'>-</p>
                          )}
                        </div>

                        <div>
                          <label className='text-sm font-medium'>Company Type</label>
                          <p className='mt-1 capitalize'>{supplier.companyType}</p>
                        </div>

                        <div>
                          <label className='text-sm font-medium'>Phone Number</label>
                          <a
                            href={`tel:${supplier.phoneNumber}`}
                            className='mt-1 flex items-center gap-2 text-primary hover:underline'
                          >
                            <Phone className='size-4' />
                            {supplier.phoneNumber}
                          </a>
                        </div>

                        <div>
                          <label className='text-sm font-medium'>Address</label>
                          <p className='mt-1 flex items-start gap-2'>
                            <MapPin className='mt-0.5 size-4 text-muted-foreground' />
                            <span>{supplier.address}</span>
                          </p>
                        </div>

                        <div>
                          <label className='text-sm font-medium'>Year Established</label>
                          <p className='mt-1 flex items-center gap-2'>
                            <Calendar className='size-4 text-muted-foreground' />
                            {supplier.yearEstablished}
                          </p>
                        </div>
                      </div>

                      <div className='space-y-4'>
                        <div>
                          <label className='text-sm font-medium'>Contact Person</label>
                          <p className='mt-1'>{supplier.contactPerson?.fullName || '-'}</p>
                          <p className='text-sm text-muted-foreground'>{supplier.country}</p>
                        </div>

                        <div>
                          <label className='text-sm font-medium'>Email</label>
                          {supplier.contactPerson?.email ? (
                            <a
                              href={`mailto:${supplier.contactPerson.email}`}
                              className='mt-1 flex items-center gap-2 text-primary hover:underline'
                            >
                              <Mail className='size-4' />
                              {supplier.contactPerson.email}
                            </a>
                          ) : (
                            <p className='mt-1 text-muted-foreground'>-</p>
                          )}
                        </div>

                        <div>
                          <label className='text-sm font-medium'>Production Capacity</label>
                          <p className='mt-1 flex items-center gap-2'>
                            <Package className='size-4 text-muted-foreground' />
                            {supplier.productionCapacity}
                          </p>
                        </div>

                        <div>
                          <label className='text-sm font-medium'>Total Workers</label>
                          <p className='mt-1 flex items-center gap-2'>
                            <Users className='size-4 text-muted-foreground' />
                            {supplier.totalWorkers} units
                          </p>
                        </div>

                        <div>
                          <label className='text-sm font-medium'>Lead Time</label>
                          <p className='mt-1'>{supplier.leadTime}</p>
                        </div>

                        <div>
                          <label className='text-sm font-medium'>Payment Terms</label>
                          <p className='mt-1'>{supplier.paymentTerms}</p>
                        </div>
                      </div>
                    </div>

                    {supplier.certifications && supplier.certifications.length > 0 && (
                      <div className='mt-6'>
                        <label className='mb-2 block text-sm font-medium'>Certifications</label>
                        <div className='flex flex-wrap gap-2'>
                          {supplier.certifications.map((cert, idx) => (
                            <Badge key={idx} variant='secondary' className='bg-blue-600 text-white'>
                              {cert.type}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div className='space-y-4'>
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className='space-y-2'>
                      {mockRecentActivity.map((activity, idx) => (
                        <div key={idx} className='text-sm'>
                          {activity}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value='contacts' className='mt-6'>
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>All contact persons for this supplier</CardDescription>
              </CardHeader>
              <CardContent>
                {supplier.contactPerson ? (
                  <div className='space-y-4'>
                    <div className='rounded-lg border p-4'>
                      <p className='font-medium'>{supplier.contactPerson.fullName || 'No name'}</p>
                      <p className='text-sm text-muted-foreground'>{supplier.contactPerson.designation || 'Primary Contact'}</p>
                      <div className='mt-2 space-y-1 text-sm'>
                        {supplier.contactPerson.email && (
                          <a href={`mailto:${supplier.contactPerson.email}`} className='flex items-center gap-2 text-primary hover:underline'>
                            <Mail className='size-4' />
                            {supplier.contactPerson.email}
                          </a>
                        )}
                        {supplier.contactPerson.phone && (
                          <a href={`tel:${supplier.contactPerson.phone}`} className='flex items-center gap-2 text-primary hover:underline'>
                            <Phone className='size-4' />
                            {supplier.contactPerson.phone}
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className='text-sm text-muted-foreground'>No contact person information</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value='capabilities' className='mt-6'>
            <Card>
              <CardHeader>
                <CardTitle>Supplier Capabilities</CardTitle>
                <CardDescription>Manufacturing and production capabilities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className='flex flex-wrap gap-2'>
                  {supplier.capabilities && supplier.capabilities.length > 0 ? (
                    supplier.capabilities.map((capability, idx) => (
                      <Badge key={idx} variant='outline'>
                        {capability}
                      </Badge>
                    ))
                  ) : (
                    <p className='text-sm text-muted-foreground'>No capabilities listed</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value='certifications' className='mt-6'>
            <Card>
              <CardHeader>
                <CardTitle>Certifications</CardTitle>
                <CardDescription>Quality and compliance certifications</CardDescription>
              </CardHeader>
              <CardContent>
                {supplier.certifications && supplier.certifications.length > 0 ? (
                  <div className='space-y-4'>
                    {supplier.certifications.map((cert, idx) => (
                      <div key={idx} className='rounded-lg border p-4'>
                        <div className='flex items-start justify-between'>
                          <div>
                            <p className='font-medium'>{cert.type}</p>
                            {cert.certificateNumber && (
                              <p className='text-sm text-muted-foreground'>
                                Certificate #: {cert.certificateNumber}
                              </p>
                            )}
                          </div>
                          <Badge variant='secondary'>{cert.type}</Badge>
                        </div>
                        <div className='mt-2 flex gap-4 text-sm text-muted-foreground'>
                          <span>Issued: {format(cert.issuedDate, 'MMM dd, yyyy')}</span>
                          <span>Expires: {format(cert.expiryDate, 'MMM dd, yyyy')}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className='text-sm text-muted-foreground'>No certifications listed</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value='documents' className='mt-6'>
            <Card>
              <CardHeader>
                <CardTitle>Documents</CardTitle>
                <CardDescription>Uploaded files and documents</CardDescription>
              </CardHeader>
              <CardContent>
                {supplier.documents && supplier.documents.length > 0 ? (
                  <div className='space-y-2'>
                    {supplier.documents.map((doc) => (
                      <div key={doc.id} className='flex items-center justify-between rounded-lg border p-3'>
                        <div>
                          <p className='font-medium'>{doc.name}</p>
                          <p className='text-sm text-muted-foreground'>{doc.type}</p>
                        </div>
                        <Button size='sm' variant='outline' asChild>
                          <a href={doc.url} target='_blank' rel='noopener noreferrer'>
                            View
                          </a>
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className='text-sm text-muted-foreground'>No documents uploaded</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value='orders' className='mt-6'>
            <Card>
              <CardHeader>
                <CardTitle>Orders & Production</CardTitle>
                <CardDescription>Order history and production tracking</CardDescription>
              </CardHeader>
              <CardContent>
                <p className='text-sm text-muted-foreground'>No order data available</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value='performance' className='mt-6'>
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>Quality and delivery performance</CardDescription>
              </CardHeader>
              <CardContent>
                <p className='text-sm text-muted-foreground'>No performance data available</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </Main>
    </>
  )
}
