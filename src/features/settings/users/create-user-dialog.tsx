import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { AxiosError } from 'axios'
import { useQuery } from '@tanstack/react-query'
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
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { UserService } from '@/services/user.service'
import { RoleService } from '@/services/role.service'

const createUserSchema = z
  .object({
    first_name: z.string().min(1, 'First name is required'),
    middle_name: z.string().optional(),
    last_name: z.string().min(1, 'Last name is required'),
    email: z.string().email('Invalid email address'),
    username: z.string().min(3, 'Username must be at least 3 characters'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirm_password: z.string().min(6, 'Please confirm your password'),
    groups: z.array(z.number()).min(1, 'Please select at least one role'),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords don't match",
    path: ['confirm_password'],
  })

type CreateUserFormData = z.infer<typeof createUserSchema>

interface CreateUserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function CreateUserDialog({
  open,
  onOpenChange,
  onSuccess,
}: CreateUserDialogProps) {
  const [isLoading, setIsLoading] = useState(false)

  const { data: roles = [] } = useQuery({
    queryKey: ['roles'],
    queryFn: () => RoleService.getRoles(),
  })

  const form = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      first_name: '',
      middle_name: '',
      last_name: '',
      email: '',
      username: '',
      password: '',
      confirm_password: '',
      groups: [],
    },
  })

  async function onSubmit(data: CreateUserFormData) {
    setIsLoading(true)

    try {
      await UserService.createUser({
        first_name: data.first_name,
        middle_name: data.middle_name,
        last_name: data.last_name,
        email: data.email,
        username: data.username,
        password: data.password,
        confirm_password: data.confirm_password,
        groups: data.groups,
      })

      toast.success('User created successfully with assigned role')
      form.reset()
      onOpenChange(false)
      onSuccess()
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorMessage =
          error.response?.data?.message ||
          error.response?.data?.detail ||
          'Failed to create user'
        toast.error(errorMessage)
      } else {
        toast.error('An error occurred. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle>Create New User</DialogTitle>
          <DialogDescription>
            Add a new user to the system. Fill in all required fields.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <div className='grid grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='first_name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name *</FormLabel>
                    <FormControl>
                      <Input placeholder='John' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='last_name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name *</FormLabel>
                    <FormControl>
                      <Input placeholder='Doe' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name='middle_name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Middle Name</FormLabel>
                  <FormControl>
                    <Input placeholder='(Optional)' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email *</FormLabel>
                  <FormControl>
                    <Input
                      type='email'
                      placeholder='john.doe@example.com'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='username'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username *</FormLabel>
                  <FormControl>
                    <Input placeholder='johndoe' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='grid grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password *</FormLabel>
                    <FormControl>
                      <Input type='password' placeholder='••••••' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='confirm_password'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password *</FormLabel>
                    <FormControl>
                      <Input type='password' placeholder='••••••' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name='groups'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Roles *</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      const roleId = parseInt(value)
                      const current = field.value || []
                      if (current.includes(roleId)) {
                        field.onChange(current.filter((id) => id !== roleId))
                      } else {
                        field.onChange([...current, roleId])
                      }
                    }}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select roles'>
                          {field.value && field.value.length > 0
                            ? `${field.value.length} role(s) selected`
                            : 'Select roles'}
                        </SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role.id} value={role.id.toString()}>
                          {role.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {field.value && field.value.length > 0 && (
                    <div className='flex flex-wrap gap-1 mt-2'>
                      {field.value.map((roleId) => {
                        const role = roles.find((r) => r.id === roleId)
                        return (
                          <Badge key={roleId} variant='secondary'>
                            {role?.name || `Role ${roleId}`}
                          </Badge>
                        )
                      })}
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

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
                {isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
                Create User
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
