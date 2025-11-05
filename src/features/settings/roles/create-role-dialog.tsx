import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
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
import { RoleService } from '@/services/role.service'

const createRoleSchema = z.object({
  name: z.string().min(1, 'Role name is required'),
})

type CreateRoleFormData = z.infer<typeof createRoleSchema>

interface CreateRoleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function CreateRoleDialog({
  open,
  onOpenChange,
  onSuccess,
}: CreateRoleDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<CreateRoleFormData>({
    resolver: zodResolver(createRoleSchema),
    defaultValues: {
      name: '',
    },
  })

  const createMutation = useMutation({
    mutationFn: RoleService.createRole,
    onSuccess: () => {
      toast.success('Role created successfully')
      form.reset()
      onSuccess()
      onOpenChange(false)
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create role')
    },
    onSettled: () => {
      setIsSubmitting(false)
    },
  })

  const onSubmit = (data: CreateRoleFormData) => {
    setIsSubmitting(true)
    createMutation.mutate(data)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Create Role</DialogTitle>
          <DialogDescription>
            Create a new role. You can assign permissions to it later.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role Name</FormLabel>
                  <FormControl>
                    <Input placeholder='e.g., Manager, Admin' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type='button'
                variant='outline'
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type='submit' disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create Role'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
