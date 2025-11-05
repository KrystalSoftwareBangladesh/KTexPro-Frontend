import { useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
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
import { Checkbox } from '@/components/ui/checkbox'
import { ScrollArea } from '@/components/ui/scroll-area'
import { RoleService } from '@/services/role.service'
import { UserService } from '@/services/user.service'

const createRoleSchema = z.object({
  name: z.string().min(1, 'Role name is required'),
  permission_ids: z.array(z.number()).optional(),
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
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([])

  const { data: permissions = [] } = useQuery({
    queryKey: ['permissions'],
    queryFn: () => UserService.getPermissions(),
  })

  const form = useForm<CreateRoleFormData>({
    resolver: zodResolver(createRoleSchema),
    defaultValues: {
      name: '',
      permission_ids: [],
    },
  })

  const togglePermission = (permissionId: number) => {
    setSelectedPermissions((prev) =>
      prev.includes(permissionId)
        ? prev.filter((id) => id !== permissionId)
        : [...prev, permissionId]
    )
  }

  const toggleSelectAll = () => {
    if (selectedPermissions.length === permissions.length) {
      setSelectedPermissions([])
    } else {
      setSelectedPermissions(permissions.map((p) => p.id))
    }
  }

  const createMutation = useMutation({
    mutationFn: async (data: CreateRoleFormData) => {
      const role = await RoleService.createRole({ name: data.name })
      if (selectedPermissions.length > 0) {
        await RoleService.updateRole(role.id, {
          permission_ids: selectedPermissions,
        })
      }
      return role
    },
    onSuccess: () => {
      toast.success('Role created successfully')
      form.reset()
      setSelectedPermissions([])
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
      <DialogContent className='sm:max-w-[550px]'>
        <DialogHeader>
          <DialogTitle>Create Role</DialogTitle>
          <DialogDescription>
            Create a new role and assign permissions.
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

            <div className='space-y-2'>
              <div className='flex items-center justify-between'>
                <FormLabel>Permissions</FormLabel>
                <Button
                  type='button'
                  variant='ghost'
                  size='sm'
                  onClick={toggleSelectAll}
                  className='h-8 text-xs'
                >
                  {selectedPermissions.length === permissions.length
                    ? 'Deselect All'
                    : 'Select All'}
                </Button>
              </div>
              <ScrollArea className='h-[300px] rounded-md border p-4'>
                <div className='space-y-3'>
                  {permissions.map((permission) => (
                    <div
                      key={permission.id}
                      className='flex items-start space-x-3'
                    >
                      <Checkbox
                        id={`permission-${permission.id}`}
                        checked={selectedPermissions.includes(permission.id)}
                        onCheckedChange={() => togglePermission(permission.id)}
                      />
                      <label
                        htmlFor={`permission-${permission.id}`}
                        className='text-sm leading-none cursor-pointer'
                      >
                        <div className='font-medium'>{permission.name}</div>
                        <div className='text-muted-foreground text-xs'>
                          {permission.codename}
                        </div>
                      </label>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>

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
