import { z } from 'zod'
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { UserService } from '@/services/user.service'
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

const profileFormSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  middle_name: z.string().optional(),
  last_name: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  username: z
    .string()
    .min(2, 'Username must be at least 2 characters.')
    .max(30, 'Username must not be longer than 30 characters.'),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

const defaultValues: Partial<ProfileFormValues> = {
  first_name: '',
  middle_name: '',
  last_name: '',
  email: '',
  username: '',
}

export function ProfileForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingProfile, setIsLoadingProfile] = useState(true)

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: 'onChange',
  })

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profile = await UserService.getUserProfile()
        const nameParts = profile.full_name.split(' ')
        form.reset({
          first_name: nameParts[0] || '',
          middle_name: nameParts.slice(1, -1).join(' ') || '',
          last_name: nameParts[nameParts.length - 1] || '',
          email: profile.email,
          username: profile.username,
        })
      } catch (error) {
        toast.error('Failed to load profile')
      } finally {
        setIsLoadingProfile(false)
      }
    }

    loadProfile()
  }, [form])

  const onSubmit = async (data: ProfileFormValues) => {
    setIsLoading(true)
    try {
      await UserService.updateProfile(data)
      toast.success('Profile updated successfully')
    } catch (error) {
      toast.error('Failed to update profile')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoadingProfile) {
    return (
      <div className='flex items-center justify-center py-8'>
        <Loader2 className='h-6 w-6 animate-spin' />
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6 max-w-2xl'>
        <FormField
          control={form.control}
          name='first_name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input placeholder='John' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='middle_name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Middle Name (Optional)</FormLabel>
              <FormControl>
                <Input placeholder='Michael' {...field} />
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
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input placeholder='Doe' {...field} />
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
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder='johndoe' {...field} />
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
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder='john@example.com' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type='submit' disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              Updating...
            </>
          ) : (
            'Update profile'
          )}
        </Button>
      </form>
    </Form>
  )
}
