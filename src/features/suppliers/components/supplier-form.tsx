import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Trash2, Upload } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
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

type SupplierFormProps = {
  supplier?: Supplier
  onSubmit?: (data: SupplierFormData) => void
  onCancel?: () => void
}

export function SupplierForm({ supplier, onSubmit, onCancel }: SupplierFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const isEdit = !!supplier

  const form = useForm<SupplierFormData>({
    resolver: zodResolver(supplierFormSchema),
    defaultValues: supplier
      ? {
          supplierName: supplier.supplierName,
          companyType: supplier.companyType,
          website: supplier.website || '',
          email: supplier.email,
          phoneNumber: supplier.phoneNumber,
          address: supplier.address,
          country: supplier.country,
          contactPerson: supplier.contactPerson,
          capabilities: supplier.capabilities,
          certifications: supplier.certifications,
          yearEstablished: supplier.yearEstablished,
          totalWorkers: supplier.totalWorkers,
          productionCapacity: supplier.productionCapacity,
          leadTime: supplier.leadTime,
          paymentTerms: supplier.paymentTerms,
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

  const handleSubmit = async (data: SupplierFormData) => {
    setIsSubmitting(true)

    setTimeout(() => {
      toast.success(
        isEdit
          ? 'Supplier updated successfully'
          : 'Supplier application submitted successfully'
      )
      setIsSubmitting(false)
      onSubmit?.(data)
    }, 1000)
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-8'>
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Provide basic details about your company
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid gap-4 md:grid-cols-2'>
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
                        <SelectTrigger>
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

            <div className='grid gap-4 md:grid-cols-2'>
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

            <div className='grid gap-4 md:grid-cols-2'>
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
                        <SelectTrigger>
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
          </CardContent>
        </Card>

        {/* Contact Person */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Person</CardTitle>
            <CardDescription>Primary contact person details</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid gap-4 md:grid-cols-2'>
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

            <div className='grid gap-4 md:grid-cols-2'>
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
          </CardContent>
        </Card>

        {/* Capabilities / Services */}
        <Card>
          <CardHeader>
            <CardTitle>Capabilities / Services</CardTitle>
            <CardDescription>
              Select all production processes your company can handle
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name='capabilities'
              render={() => (
                <FormItem>
                  <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
                    {capabilities.map((capability) => (
                      <FormField
                        key={capability.value}
                        control={form.control}
                        name='capabilities'
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={capability.value}
                              className='flex flex-row items-start space-x-3 space-y-0'
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
                              <div className='space-y-1 leading-none'>
                                <FormLabel className='font-normal cursor-pointer'>
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
          </CardContent>
        </Card>

        {/* Certifications */}
        <Card>
          <CardHeader>
            <CardTitle>Certifications</CardTitle>
            <CardDescription>
              Add your company certifications (BSCI, SEDEX, etc.)
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
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

                <div className='grid gap-4 md:grid-cols-2'>
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
                            <SelectTrigger>
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

                <div className='grid gap-4 md:grid-cols-2'>
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
                            onChange={(e) => field.onChange(new Date(e.target.value))}
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
                            onChange={(e) => field.onChange(new Date(e.target.value))}
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
          </CardContent>
        </Card>

        {/* Factory Details */}
        <Card>
          <CardHeader>
            <CardTitle>Factory Details</CardTitle>
            <CardDescription>Production capacity and operational details</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid gap-4 md:grid-cols-3'>
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
                        min='1'
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
                        <SelectTrigger>
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

            <div className='grid gap-4 md:grid-cols-2'>
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
                    <FormDescription>
                      Standard production lead time
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Documents Upload */}
        <Card>
          <CardHeader>
            <CardTitle>Documents Upload</CardTitle>
            <CardDescription>
              Upload trade license, certificates, or factory profile (PDF/Image)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='flex items-center justify-center rounded-lg border-2 border-dashed p-12'>
              <div className='text-center'>
                <Upload className='mx-auto size-12 text-muted-foreground' />
                <p className='mt-2 text-sm text-muted-foreground'>
                  Drag and drop files here, or click to browse
                </p>
                <p className='text-xs text-muted-foreground'>
                  PDF, PNG, JPG up to 10MB
                </p>
                <Input
                  type='file'
                  multiple
                  accept='.pdf,.png,.jpg,.jpeg'
                  className='mt-4'
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Separator />

        {/* Form Actions */}
        <div className='flex justify-end gap-4'>
          {onCancel && (
            <Button
              type='button'
              variant='outline'
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          )}
          <Button type='submit' disabled={isSubmitting}>
            {isSubmitting
              ? 'Submitting...'
              : isEdit
                ? 'Update Supplier'
                : 'Submit Application'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
