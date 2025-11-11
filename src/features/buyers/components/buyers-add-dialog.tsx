import { useEffect } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { BuyerService } from '@/services/buyer.service'
import { RoleService } from '@/services/role.service'
import type { CreateBuyerContactPerson, CreateBuyerRequest, UpdateBuyerRequest } from '@/types/buyer'
import { useBuyers } from './buyers-provider'
import { ContactPersonFields } from './contact-person-fields'

const buyerSchema = z.object({
  name: z.string().min(1, 'Company name is required'),
  industry: z.string().min(1, 'Industry is required'),
  website: z.string().url('Invalid website URL').optional().or(z.literal('')),
  email: z.string().email('Invalid email address'),
  phone_number: z.string().min(1, 'Phone number is required'),
  billing_address: z.string().min(1, 'Billing address is required'),
  new_contact_persons: z.array(
    z.object({
      first_name: z.string().min(1, 'First name is required'),
      middle_name: z.string().optional(),
      last_name: z.string().min(1, 'Last name is required'),
      email: z.string().email('Invalid email address'),
      username: z.string().min(3, 'Username must be at least 3 characters'),
      password: z.string().min(6, 'Password must be at least 6 characters'),
      confirm_password: z.string().min(6, 'Please confirm password'),
      groups: z.array(z.number()).min(1, 'Please select at least one role'),
    }).refine((data) => data.password === data.confirm_password, {
      message: "Passwords don't match",
      path: ['confirm_password'],
    })
  ).optional(),
})

type BuyerFormData = z.infer<typeof buyerSchema>

type BuyersAddDialogProps = {
  open: boolean
}

export function BuyersAddDialog({ open }: BuyersAddDialogProps) {
  const { setOpen, currentRow } = useBuyers()
  const queryClient = useQueryClient()
  const isEdit = !!currentRow

  const { data: roles = [], isLoading: rolesLoading } = useQuery({
    queryKey: ['roles'],
    queryFn: () => RoleService.getRoles(),
  })

  const form = useForm<BuyerFormData>({
    resolver: zodResolver(buyerSchema),
    defaultValues: {
      name: '',
      industry: '',
      website: '',
      email: '',
      phone_number: '',
      billing_address: '',
      new_contact_persons: [],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'new_contact_persons',
  })

  useEffect(() => {
    if (open && currentRow) {
      form.reset({
        name: currentRow.name || '',
        industry: currentRow.industry || '',
        website: currentRow.website || '',
        email: currentRow.email || '',
        phone_number: currentRow.phone_number || '',
        billing_address: currentRow.billing_address || '',
        new_contact_persons: [],
      })
    } else if (open && !currentRow) {
      form.reset({
        name: '',
        industry: '',
        website: '',
        email: '',
        phone_number: '',
        billing_address: '',
        new_contact_persons: [],
      })
    }
  }, [open, currentRow, form])

  const createMutation = useMutation({
    mutationFn: (data: CreateBuyerRequest) => BuyerService.createBuyer(data),
    onSuccess: () => {
      toast.success('Buyer created successfully')
      queryClient.invalidateQueries({ queryKey: ['buyers'] })
      setOpen(null)
    },
    onError: () => {
      toast.error('Failed to create buyer')
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateBuyerRequest }) =>
      BuyerService.updateBuyer(id, data),
    onSuccess: async (_data, variables) => {
      toast.success('Buyer updated successfully')
      queryClient.invalidateQueries({ queryKey: ['buyers'] })
      queryClient.invalidateQueries({ queryKey: ['buyer', variables.id.toString()] })
      setOpen(null)
    },
    onError: () => {
      toast.error('Failed to update buyer')
    },
  })

  const addContactPersonsMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: { contact_persons: CreateBuyerContactPerson[] } }) =>
      BuyerService.addContactPersons(id, data.contact_persons),
    onSuccess: (_data, variables) => {
      toast.success('Contact persons added successfully')
      queryClient.invalidateQueries({ queryKey: ['buyers'] })
      queryClient.invalidateQueries({ queryKey: ['buyer', variables.id.toString()] })
    },
    onError: () => {
      toast.error('Failed to add contact persons')
    },
  })

  const onSubmit = async (data: BuyerFormData) => {
    if (isEdit && currentRow) {
      // Edit mode: update buyer info only (no contact_persons)
      const buyerPayload: UpdateBuyerRequest = {
        name: data.name,
        industry: data.industry,
        website: data.website || '',
        email: data.email,
        phone_number: data.phone_number,
        billing_address: data.billing_address,
      }

      await updateMutation.mutateAsync({ id: currentRow.id, data: buyerPayload })

      // If new contact persons were added, add them separately
      if (data.new_contact_persons && data.new_contact_persons.length > 0) {
        const contactPersonsPayload = {
          contact_persons: data.new_contact_persons.map((cp) => ({
            first_name: cp.first_name,
            middle_name: cp.middle_name || '',
            last_name: cp.last_name,
            email: cp.email,
            username: cp.username,
            password: cp.password,
            confirm_password: cp.confirm_password,
            groups: cp.groups,
          })),
        }
        await addContactPersonsMutation.mutateAsync({
          id: currentRow.id,
          data: contactPersonsPayload,
        })
      }
    } else {
      // Create mode: include contact_persons in the payload
      const createPayload: CreateBuyerRequest = {
        name: data.name,
        industry: data.industry,
        website: data.website || '',
        email: data.email,
        phone_number: data.phone_number,
        billing_address: data.billing_address,
        contact_persons: data.new_contact_persons?.map((cp) => ({
          first_name: cp.first_name,
          middle_name: cp.middle_name || '',
          last_name: cp.last_name,
          email: cp.email,
          username: cp.username,
          password: cp.password,
          confirm_password: cp.confirm_password,
          groups: cp.groups,
        })),
      }
      createMutation.mutate(createPayload)
    }
  }

  const isLoading = createMutation.isPending || updateMutation.isPending

  const handleAddContactPerson = () => {
    append({
      first_name: '',
      middle_name: '',
      last_name: '',
      email: '',
      username: '',
      password: '',
      confirm_password: '',
      groups: [],
    })
  }

  return (
    <Dialog open={open} onOpenChange={() => setOpen(null)}>
      <DialogContent className='sm:max-w-4xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit' : 'Add'} Buyer</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Update' : 'Add'} buyer information and contact persons. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            {/* Buyer Information */}
            <div className='space-y-4'>
              <h3 className='text-lg font-semibold'>Buyer Information</h3>
              <div className='grid gap-4 sm:grid-cols-1 md:grid-cols-2'>
                <FormField
                  control={form.control}
                  name='name'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name *</FormLabel>
                      <FormControl>
                        <Input placeholder='Acme Corp' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='industry'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Industry *</FormLabel>
                      <FormControl>
                        <Input placeholder='Manufacturing' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className='grid gap-4 sm:grid-cols-1 md:grid-cols-2'>
                <FormField
                  control={form.control}
                  name='email'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email *</FormLabel>
                      <FormControl>
                        <Input type='email' placeholder='contact@acme.com' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='phone_number'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone *</FormLabel>
                      <FormControl>
                        <Input placeholder='+1 234 567 8900' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name='website'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website</FormLabel>
                    <FormControl>
                      <Input type='url' placeholder='https://acme.com' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='billing_address'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Billing Address *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='123 Main St, City, Country'
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            {/* Existing Contact Persons (Edit Mode Only) */}
            {isEdit && currentRow && currentRow.contact_persons && currentRow.contact_persons.length > 0 && (
              <>
                <div className='space-y-4'>
                  <h3 className='text-lg font-semibold'>Existing Contact Persons</h3>
                  {currentRow.contact_persons.map((contact) => (
                    <div key={contact.id} className='space-y-2 p-4 border rounded-lg bg-muted/30'>
                      <div className='grid gap-3 sm:grid-cols-2'>
                        <div>
                          <p className='text-sm font-medium text-muted-foreground'>Name</p>
                          <p className='text-sm'>{contact.full_name || `${contact.first_name} ${contact.last_name}`}</p>
                        </div>
                        <div>
                          <p className='text-sm font-medium text-muted-foreground'>Email</p>
                          <p className='text-sm'>{contact.email}</p>
                        </div>
                        <div>
                          <p className='text-sm font-medium text-muted-foreground'>Username</p>
                          <p className='text-sm'>{contact.username}</p>
                        </div>
                        <div>
                          <p className='text-sm font-medium text-muted-foreground'>Roles</p>
                          <div className='flex flex-wrap gap-1'>
                            {contact.groups.map((groupId) => {
                              const role = roles.find((r) => r.id === groupId)
                              return role ? (
                                <span key={groupId} className='text-xs bg-primary/10 text-primary px-2 py-1 rounded'>
                                  {role.name}
                                </span>
                              ) : null
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Separator />
              </>
            )}

            {/* Add New Contact Persons */}
            <div className='space-y-4'>
              <div className='flex items-center justify-between'>
                <h3 className='text-lg font-semibold'>
                  {isEdit ? 'Add New Contact Persons' : 'Contact Persons'}
                </h3>
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={handleAddContactPerson}
                  disabled={isLoading || rolesLoading}
                >
                  <Plus className='h-4 w-4 mr-2' />
                  Add Contact Person
                </Button>
              </div>

              {fields.length === 0 && !isEdit && (
                <p className='text-sm text-muted-foreground'>
                  No contact persons added yet. Click &quot;Add Contact Person&quot; to create one.
                </p>
              )}

              {fields.map((field, index) => (
                <div key={field.id} className='space-y-4 p-4 border rounded-lg'>
                  <div className='flex items-center justify-between'>
                    <h4 className='font-medium'>New Contact Person {index + 1}</h4>
                    <Button
                      type='button'
                      variant='ghost'
                      size='sm'
                      onClick={() => remove(index)}
                      disabled={isLoading}
                    >
                      <Trash2 className='h-4 w-4 text-destructive' />
                    </Button>
                  </div>
                  <ContactPersonFields
                    control={form.control}
                    index={index}
                    roles={roles}
                    rolesLoading={rolesLoading}
                  />
                </div>
              ))}
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
              <Button type='submit' disabled={isLoading || rolesLoading}>
                {isLoading ? 'Saving...' : 'Save'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
