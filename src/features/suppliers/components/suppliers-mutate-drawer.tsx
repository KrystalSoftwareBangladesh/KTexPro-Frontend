/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ChevronLeft, ChevronRight, Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Stepper } from '@/components/ui/stepper'
import {
  capabilities,
  certificationTypes,
  companyTypes,
  countries,
  paymentTerms,
} from '../data/data'
import {
  supplierFormSchema,
  type Supplier,
  type SupplierFormData,
} from '../data/schema'

type SupplierMutateDrawerProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: Supplier
}

const STEPS = [
  { id: 'basic', title: 'Basic Info', description: 'Company details' },
  { id: 'contact', title: 'Contact', description: 'Contact person' },
  { id: 'capabilities', title: 'Capabilities', description: 'Services' },
  { id: 'certifications', title: 'Certifications', description: 'Certificates' },
  { id: 'factory', title: 'Factory', description: 'Production details' },
]

export function SuppliersMutateDrawer({
  open,
  onOpenChange,
  currentRow,
}: SupplierMutateDrawerProps) {
  const isUpdate = !!currentRow
  const [currentStep, setCurrentStep] = useState(0)

  const form = useForm<SupplierFormData>({
    resolver: zodResolver(supplierFormSchema as any),
    defaultValues: currentRow
      ? {
          supplierName: currentRow.supplierName,
          companyType: currentRow.companyType,
          website: currentRow.website || '',
          email: currentRow.email,
          phoneNumber: currentRow.phoneNumber,
          address: currentRow.address,
          country: currentRow.country,
          contactPerson: currentRow.contactPerson,
          capabilities: currentRow.capabilities,
          certifications: currentRow.certifications,
          yearEstablished: currentRow.yearEstablished,
          totalWorkers: currentRow.totalWorkers,
          productionCapacity: currentRow.productionCapacity,
          leadTime: currentRow.leadTime,
          paymentTerms: currentRow.paymentTerms,
        }
      : {
          supplierName: '',
          companyType: 'factory',
          website: '',
          email: '',
          phoneNumber: '',
          address: '',
          country: '',
          contactPerson: {
            fullName: '',
            designation: '',
            phone: '',
            email: '',
          },
          capabilities: [],
          certifications: [],
          yearEstablished: new Date().getFullYear(),
          totalWorkers: 0,
          productionCapacity: '',
          leadTime: '',
          paymentTerms: 'TT',
        },
  })

  const certifications = form.watch('certifications')

  useEffect(() => {
    if (open) {
      const formData = currentRow
        ? {
            supplierName: currentRow.supplierName,
            companyType: currentRow.companyType,
            website: currentRow.website || '',
            email: currentRow.email,
            phoneNumber: currentRow.phoneNumber,
            address: currentRow.address,
            country: currentRow.country,
            contactPerson: currentRow.contactPerson,
            capabilities: currentRow.capabilities,
            certifications: currentRow.certifications,
            yearEstablished: currentRow.yearEstablished,
            totalWorkers: currentRow.totalWorkers,
            productionCapacity: currentRow.productionCapacity,
            leadTime: currentRow.leadTime,
            paymentTerms: currentRow.paymentTerms,
          }
        : {
            supplierName: '',
            companyType: 'factory' as const,
            website: '',
            email: '',
            phoneNumber: '',
            address: '',
            country: '',
            contactPerson: {
              fullName: '',
              designation: '',
              phone: '',
              email: '',
            },
            capabilities: [],
            certifications: [],
            yearEstablished: new Date().getFullYear(),
            totalWorkers: 0,
            productionCapacity: '',
            leadTime: '',
            paymentTerms: 'TT' as const,
          }
      form.reset(formData)
      setCurrentStep(0)
    }
  }, [open, currentRow, form])

  const onSubmit = async (_data: SupplierFormData) => {
    toast.success(
      isUpdate
        ? 'Supplier updated successfully'
        : 'Supplier created successfully'
    )
    onOpenChange(false)
  }

  const addCertification = () => {
    const current = form.getValues('certifications')
    form.setValue('certifications', [
      ...current,
      {
        id: `temp-${Date.now()}`,
        type: 'BSCI',
        certificateNumber: '',
        issuedDate: new Date(),
        expiryDate: new Date(),
      },
    ])
  }

  const removeCertification = (index: number) => {
    const current = form.getValues('certifications')
    form.setValue(
      'certifications',
      current.filter((_, i) => i !== index)
    )
  }

  const handleNext = async () => {
    const fields = getFieldsForStep(currentStep)
    const isValid = await form.trigger(fields as any)
    
    if (isValid && currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const getFieldsForStep = (step: number): string[] => {
    switch (step) {
      case 0:
        return ['supplierName', 'companyType', 'email', 'phoneNumber', 'website', 'country', 'address']
      case 1:
        return ['contactPerson.fullName', 'contactPerson.designation', 'contactPerson.email', 'contactPerson.phone']
      case 2:
        return ['capabilities']
      case 3:
        return ['certifications']
      case 4:
        return ['yearEstablished', 'totalWorkers', 'paymentTerms', 'productionCapacity', 'leadTime']
      default:
        return []
    }
  }

  const handleClose = (isOpen: boolean) => {
    if (!isOpen) {
      onOpenChange(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent className='flex w-full flex-col gap-0 p-0 sm:max-w-2xl md:max-w-3xl lg:max-w-4xl'>
        <SheetHeader className='space-y-4 border-b p-6 pb-4'>
          <div className='space-y-1 text-start'>
            <SheetTitle>{isUpdate ? 'Update' : 'Create'} Supplier</SheetTitle>
            <SheetDescription>
              {isUpdate
                ? 'Update supplier information by filling out the form below.'
                : 'Add a new supplier by providing the necessary details.'}
            </SheetDescription>
          </div>
          <Stepper steps={STEPS} currentStep={currentStep} />
        </SheetHeader>

        <Form {...form}>
          <form
            id='supplier-form'
            onSubmit={form.handleSubmit(onSubmit)}
            className='flex-1 overflow-y-auto px-6 py-4'
          >
            {/* Step 0: Basic Information */}
            {currentStep === 0 && (
              <div className='space-y-4'>
                <div>
                  <h3 className='text-lg font-medium'>Basic Information</h3>
                  <p className='text-sm text-muted-foreground'>
                    Provide basic details about your company
                  </p>
                </div>
                <Separator />

                <div className='grid gap-4 sm:grid-cols-2'>
                  <FormField
                    control={form.control}
                    name='supplierName'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Supplier Name *</FormLabel>
                        <FormControl>
                          <Input placeholder='Company Name Ltd.' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='companyType'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Type *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className='w-full'>
                              <SelectValue placeholder='Select type' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {companyTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className='grid gap-4 sm:grid-cols-2'>
                  <FormField
                    control={form.control}
                    name='email'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email *</FormLabel>
                        <FormControl>
                          <Input
                            type='email'
                            placeholder='info@company.com'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='phoneNumber'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number *</FormLabel>
                        <FormControl>
                          <Input placeholder='+880 1234 567890' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className='grid gap-4 sm:grid-cols-2'>
                  <FormField
                    control={form.control}
                    name='website'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Website</FormLabel>
                        <FormControl>
                          <Input
                            type='url'
                            placeholder='https://www.company.com'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='country'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className='w-full'>
                              <SelectValue placeholder='Select country' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {countries.map((country) => (
                              <SelectItem key={country} value={country}>
                                {country}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name='address'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder='Street address, city, postal code'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {/* Step 1: Contact Person */}
            {currentStep === 1 && (
              <div className='space-y-4'>
                <div>
                  <h3 className='text-lg font-medium'>Contact Person</h3>
                  <p className='text-sm text-muted-foreground'>
                    Primary contact person details
                  </p>
                </div>
                <Separator />

                <div className='grid gap-4 sm:grid-cols-2'>
                  <FormField
                    control={form.control}
                    name='contactPerson.fullName'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name *</FormLabel>
                        <FormControl>
                          <Input placeholder='John Doe' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='contactPerson.designation'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Designation *</FormLabel>
                        <FormControl>
                          <Input placeholder='General Manager' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className='grid gap-4 sm:grid-cols-2'>
                  <FormField
                    control={form.control}
                    name='contactPerson.email'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email *</FormLabel>
                        <FormControl>
                          <Input
                            type='email'
                            placeholder='john@company.com'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='contactPerson.phone'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone *</FormLabel>
                        <FormControl>
                          <Input placeholder='+880 1234 567890' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            )}

            {/* Step 2: Capabilities / Services */}
            {currentStep === 2 && (
              <div className='space-y-4'>
                <div>
                  <h3 className='text-lg font-medium'>Capabilities / Services</h3>
                  <p className='text-sm text-muted-foreground'>
                    Select all production processes your company can handle
                  </p>
                </div>
                <Separator />

                <FormField
                  control={form.control}
                  name='capabilities'
                  render={() => (
                    <FormItem>
                      <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
                        {capabilities.map((capability) => (
                          <FormField
                            key={capability.value}
                            control={form.control}
                            name='capabilities'
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={capability.value}
                                  className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3'
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(capability.value)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...field.value, capability.value])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== capability.value
                                              )
                                            )
                                      }}
                                    />
                                  </FormControl>
                                  <div className='flex-1 space-y-1 leading-none'>
                                    <FormLabel className='cursor-pointer font-normal'>
                                      {capability.label}
                                    </FormLabel>
                                    <FormDescription className='text-xs'>
                                      {capability.description}
                                    </FormDescription>
                                  </div>
                                </FormItem>
                              )
                            }}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {/* Step 3: Certifications */}
            {currentStep === 3 && (
              <div className='space-y-4'>
                <div>
                  <h3 className='text-lg font-medium'>Certifications</h3>
                  <p className='text-sm text-muted-foreground'>
                    Add your company certifications (BSCI, SEDEX, etc.)
                  </p>
                </div>
                <Separator />

                <div className='space-y-4'>
                  {certifications.map((cert, index) => (
                    <div key={cert.id} className='space-y-4 rounded-lg border p-4'>
                      <div className='flex items-center justify-between'>
                        <h4 className='text-sm font-medium'>
                          Certification {index + 1}
                        </h4>
                        <Button
                          type='button'
                          variant='ghost'
                          size='sm'
                          onClick={() => removeCertification(index)}
                        >
                          <Trash2 className='size-4' />
                        </Button>
                      </div>

                      <div className='grid gap-4 sm:grid-cols-2'>
                        <FormField
                          control={form.control}
                          name={`certifications.${index}.type`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Type</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className='w-full'>
                                    <SelectValue placeholder='Select type' />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {certificationTypes.map((type) => (
                                    <SelectItem key={type.value} value={type.value}>
                                      {type.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`certifications.${index}.certificateNumber`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Certificate Number</FormLabel>
                              <FormControl>
                                <Input placeholder='CERT-12345' {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className='grid gap-4 sm:grid-cols-2'>
                        <FormField
                          control={form.control}
                          name={`certifications.${index}.issuedDate`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Issued Date</FormLabel>
                              <FormControl>
                                <Input
                                  type='date'
                                  value={
                                    field.value instanceof Date
                                      ? field.value.toISOString().split('T')[0]
                                      : ''
                                  }
                                  onChange={(e) =>
                                    field.onChange(new Date(e.target.value))
                                  }
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`certifications.${index}.expiryDate`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Expiry Date</FormLabel>
                              <FormControl>
                                <Input
                                  type='date'
                                  value={
                                    field.value instanceof Date
                                      ? field.value.toISOString().split('T')[0]
                                      : ''
                                  }
                                  onChange={(e) =>
                                    field.onChange(new Date(e.target.value))
                                  }
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  ))}

                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    onClick={addCertification}
                    className='w-full'
                  >
                    <Plus className='mr-2 size-4' />
                    Add Certification
                  </Button>
                </div>
              </div>
            )}

            {/* Step 4: Factory Details */}
            {currentStep === 4 && (
              <div className='space-y-4'>
                <div>
                  <h3 className='text-lg font-medium'>Factory Details</h3>
                  <p className='text-sm text-muted-foreground'>
                    Production capacity and operational details
                  </p>
                </div>
                <Separator />

                <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
                  <FormField
                    control={form.control}
                    name='yearEstablished'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Year Established *</FormLabel>
                        <FormControl>
                          <Input
                            type='number'
                            min='1900'
                            max={new Date().getFullYear()}
                            placeholder='2025'
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='totalWorkers'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Total Workers *</FormLabel>
                        <FormControl>
                          <Input
                            type='number'
                            min='0'
                            placeholder='500'
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='paymentTerms'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Payment Terms *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className='w-full'>
                              <SelectValue placeholder='Select terms' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {paymentTerms.map((term) => (
                              <SelectItem key={term.value} value={term.value}>
                                {term.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className='grid gap-4 sm:grid-cols-2'>
                  <FormField
                    control={form.control}
                    name='productionCapacity'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Production Capacity *</FormLabel>
                        <FormControl>
                          <Input placeholder='50000 pieces/month' {...field} />
                        </FormControl>
                        <FormDescription>
                          e.g., 50000 pieces/month or 1000 kg/day
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='leadTime'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Lead Time *</FormLabel>
                        <FormControl>
                          <Input placeholder='30-45 days' {...field} />
                        </FormControl>
                        <FormDescription>Standard production lead time</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            )}
          </form>
        </Form>

        <SheetFooter className='flex-row justify-between gap-2 border-t p-6 pt-4'>
          <div className='flex gap-2'>
            <Button
              type='button'
              variant='outline'
              onClick={handlePrevious}
              disabled={currentStep === 0}
            >
              <ChevronLeft className='mr-1 size-4' />
              Previous
            </Button>
          </div>

          <div className='flex gap-2'>
            <SheetClose asChild>
              <Button type='button' variant='ghost'>
                Cancel
              </Button>
            </SheetClose>
            
            {currentStep < STEPS.length - 1 ? (
              <Button type='button' onClick={handleNext}>
                Next
                <ChevronRight className='ml-1 size-4' />
              </Button>
            ) : (
              <Button form='supplier-form' type='submit'>
                {isUpdate ? 'Update' : 'Create'} Supplier
              </Button>
            )}
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
