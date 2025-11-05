import { useState, useEffect } from 'react'
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
import type { Role } from '@/types/auth'

const editRoleSchema = z.object({
  name: z.string().min(1, 'Role name is required'),
  permission_ids: z.array(z.number()).optional(),
})

type EditRoleFormData = z.infer<typeof editRoleSchema>

interface EditRoleDialogProps {
  role: Role
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function EditRoleDialog({
  role,
  open,
  onOpenChange,
  onSuccess,
}: EditRoleDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([])

  const { data: permissions = [] } = useQuery({
    queryKey: ['permissions'],
    queryFn: () => UserService.getPermissions(),
  })

  const form = useForm<EditRoleFormData>({
    resolver: zodResolver(editRoleSchema),
    defaultValues: {
      name: role.name,
      permission_ids: role.permissions?.map((p) => p.id) || [],
    },
  })

  useEffect(() => {
    setSelectedPermissions(role.permissions?.map((p) => p.id) || [])
    form.reset({
      name: role.name,
      permission_ids: role.permissions?.map((p) => p.id) || [],
    })
  }, [role, form])

  const updateMutation = useMutation({
    mutationFn: (data: EditRoleFormData) =>
      RoleService.updateRole(role.id, data),
    onSuccess: () => {
      toast.success('Role updated successfully')
      onSuccess()
      onOpenChange(false)
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update role')
    },
    onSettled: () => {
      setIsSubmitting(false)
    },
  })

  const togglePermission = (permissionId: number) => {
    setSelectedPermissions((prev) =>
      prev.includes(permissionId)
        ? prev.filter((id) => id !== permissionId)
        : [...prev, permissionId]
    )
  }

  const onSubmit = (data: EditRoleFormData) => {
    setIsSubmitting(true)
    updateMutation.mutate({
      ...data,
      permission_ids: selectedPermissions,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[550px]'>
        <DialogHeader>
          <DialogTitle>Edit Role</DialogTitle>
          <DialogDescription>
            Update the role name and assign permissions.
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
              <FormLabel>Permissions</FormLabel>
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
                {isSubmitting ? 'Updating...' : 'Update Role'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
