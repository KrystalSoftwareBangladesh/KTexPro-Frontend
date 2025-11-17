import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useQuery } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useCreateStyle, useUpdateStyle } from '../hooks/use-style-mutations'
import { BuyerService } from '@/services/buyer.service'
import { SupplierService } from '@/services/supplier.service'
import { UserService } from '@/services/user.service'
import type { Style } from '@/types/style'

const styleFormSchema = z.object({
  styleNumber: z.string().min(1, 'Style number is required'),
  styleName: z.string().min(1, 'Style name is required'),
  season: z.string().min(1, 'Season is required'),
  brand: z.string().min(1, 'Brand is required'),
  department: z.string().min(1, 'Department is required'),
  buyerId: z.number().min(1, 'Buyer is required'),
  supplierId: z.number().min(1, 'Supplier is required'),
  merchandiserId: z.number().min(1, 'Merchandiser is required'),
})

type StyleFormData = z.infer<typeof styleFormSchema>

interface StyleFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  style?: Style
}

export function StyleFormDialog({
  open,
  onOpenChange,
  style,
}: StyleFormDialogProps) {
  const isEdit = !!style
  const createMutation = useCreateStyle()
  const updateMutation = useUpdateStyle()

  const { data: buyers = [], isLoading: buyersLoading } = useQuery({
    queryKey: ['buyers'],
    queryFn: () => BuyerService.getBuyers(),
  })

  const { data: suppliersResponse, isLoading: suppliersLoading } = useQuery({
    queryKey: ['suppliers'],
    queryFn: () => SupplierService.getSuppliers({}),
  })

  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => UserService.getUserList(),
  })

  const suppliers = suppliersResponse?.data || []

  const form = useForm<StyleFormData>({
    resolver: zodResolver(styleFormSchema),
    defaultValues: {
      styleNumber: '',
      styleName: '',
      season: '',
      brand: '',
      department: '',
      buyerId: undefined as any,
      supplierId: undefined as any,
      merchandiserId: undefined as any,
    },
  })

  useEffect(() => {
    if (open && style) {
      form.reset({
        styleNumber: style.styleNumber || '',
        styleName: style.styleName || '',
        season: style.season || '',
        brand: style.brand || '',
        department: style.department || '',
        buyerId: style.buyerSummary?.id || (undefined as any),
        supplierId: style.supplierSummary?.id || (undefined as any),
        merchandiserId: style.merchandiserId || (undefined as any),
      })
    } else if (open && !style) {
      form.reset({
        styleNumber: '',
        styleName: '',
        season: '',
        brand: '',
        department: '',
        buyerId: undefined as any,
        supplierId: undefined as any,
        merchandiserId: undefined as any,
      })
    }
  }, [open, style, form])

  const onSubmit = async (data: StyleFormData) => {
    try {
      if (isEdit && style) {
        await updateMutation.mutateAsync({ id: style.id, data })
      } else {
        await createMutation.mutateAsync(data)
      }
      onOpenChange(false)
      form.reset()
    } catch (error) {
      console.error('Error submitting form:', error)
    }
  }

  const isLoading =
    createMutation.isPending ||
    updateMutation.isPending ||
    buyersLoading ||
    suppliersLoading ||
    usersLoading

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Style' : 'Create New Style'}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Update the style information below.'
              : 'Fill in the details to create a new style.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <div className='grid gap-4 sm:grid-cols-2'>
              <FormField
                control={form.control}
                name='styleNumber'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Style Number *</FormLabel>
                    <FormControl>
                      <Input placeholder='e.g., STY-2024-001' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='styleName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Style Name *</FormLabel>
                    <FormControl>
                      <Input placeholder='e.g., Summer Casual Shirt' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='season'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Season *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select season' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='Spring/Summer 2024'>
                          Spring/Summer 2024
                        </SelectItem>
                        <SelectItem value='Fall/Winter 2024'>
                          Fall/Winter 2024
                        </SelectItem>
                        <SelectItem value='Spring/Summer 2025'>
                          Spring/Summer 2025
                        </SelectItem>
                        <SelectItem value='Fall/Winter 2025'>
                          Fall/Winter 2025
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='brand'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brand *</FormLabel>
                    <FormControl>
                      <Input placeholder='e.g., Zara' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='buyerId'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Buyer *</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(Number(value))}
                      value={field.value ? String(field.value) : ''}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select buyer' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {buyersLoading ? (
                          <SelectItem value='0' disabled>
                            Loading...
                          </SelectItem>
                        ) : (
                          buyers.map((buyer) => (
                            <SelectItem key={buyer.id} value={String(buyer.id)}>
                              {buyer.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='supplierId'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Supplier *</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(Number(value))}
                      value={field.value ? String(field.value) : ''}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select supplier' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {suppliersLoading ? (
                          <SelectItem value='0' disabled>
                            Loading...
                          </SelectItem>
                        ) : (
                          suppliers.map((supplier) => (
                            <SelectItem
                              key={supplier.id}
                              value={String(supplier.id)}
                            >
                              {supplier.supplierName}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='merchandiserId'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Merchandiser *</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(Number(value))}
                      value={field.value ? String(field.value) : ''}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select merchandiser' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {usersLoading ? (
                          <SelectItem value='0' disabled>
                            Loading...
                          </SelectItem>
                        ) : (
                          users.map((user) => (
                            <SelectItem key={user.id} value={String(user.id)}>
                              {user.full_name || user.username}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='department'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department *</FormLabel>
                    <FormControl>
                      <Input placeholder='e.g., Apparel' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button
                type='button'
                variant='outline'
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type='submit' disabled={isLoading}>
                {isLoading && <Loader2 className='mr-2 size-4 animate-spin' />}
                {isEdit ? 'Update Style' : 'Create Style'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
