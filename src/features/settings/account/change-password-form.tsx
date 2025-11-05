import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { PasswordInput } from '@/components/password-input'
import { UserService } from '@/services/user.service'

const changePasswordSchema = z
  .object({
    old_password: z.string().min(1, 'Current password is required'),
    new_password: z
      .string()
      .min(8, 'New password must be at least 8 characters'),
    confirm_new_password: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.new_password === data.confirm_new_password, {
    message: "Passwords don't match",
    path: ['confirm_new_password'],
  })

type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>

export function ChangePasswordForm() {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      old_password: '',
      new_password: '',
      confirm_new_password: '',
    },
  })

  const onSubmit = async (data: ChangePasswordFormValues) => {
    setIsLoading(true)
    try {
      await UserService.changePassword(data)
      toast.success('Password changed successfully')
      form.reset()
    } catch (error) {
      toast.error('Failed to change password. Please check your current password.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6 max-w-2xl'>
        <FormField
          control={form.control}
          name='old_password'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder='Enter current password' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='new_password'
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder='Enter new password' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='confirm_new_password'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm New Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder='Confirm new password' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type='submit' disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              Changing...
            </>
          ) : (
            'Change Password'
          )}
        </Button>
      </form>
    </Form>
  )
}
