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
import { Form, FormLabel } from '@/components/ui/form'
import { Checkbox } from '@/components/ui/checkbox'
import { ScrollArea } from '@/components/ui/scroll-area'
import { UserService } from '@/services/user.service'
import { RoleService } from '@/services/role.service'
import type { User } from '@/types/auth'

const assignRoleSchema = z.object({
  groups: z.array(z.number()).min(1, 'Select at least one role'),
})

type AssignRoleFormData = z.infer<typeof assignRoleSchema>

interface AssignRoleDialogProps {
  user: User
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function AssignRoleDialog({
  user,
  open,
  onOpenChange,
  onSuccess,
}: AssignRoleDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedGroups, setSelectedGroups] = useState<number[]>([])

  const { data: roles = [] } = useQuery({
    queryKey: ['roles'],
    queryFn: () => RoleService.getRoles(),
  })

  const form = useForm<AssignRoleFormData>({
    resolver: zodResolver(assignRoleSchema),
    defaultValues: {
      groups: user.groups || [],
    },
  })

  useEffect(() => {
    setSelectedGroups(user.groups || [])
    form.reset({
      groups: user.groups || [],
    })
  }, [user, form])

  const assignMutation = useMutation({
    mutationFn: (data: AssignRoleFormData) =>
      UserService.assignRole(user.id, {
        username: user.username,
        email: user.email,
        groups: data.groups,
      }),
    onSuccess: () => {
      toast.success('Roles assigned successfully')
      onSuccess()
      onOpenChange(false)
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to assign roles')
    },
    onSettled: () => {
      setIsSubmitting(false)
    },
  })

  const toggleGroup = (groupId: number) => {
    const newGroups = selectedGroups.includes(groupId)
      ? selectedGroups.filter((id) => id !== groupId)
      : [...selectedGroups, groupId]
    
    setSelectedGroups(newGroups)
    form.setValue('groups', newGroups)
  }

  const onSubmit = (data: AssignRoleFormData) => {
    if (data.groups.length === 0) {
      toast.error('Please select at least one role')
      return
    }
    
    setIsSubmitting(true)
    assignMutation.mutate({
      groups: data.groups,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[450px]'>
        <DialogHeader>
          <DialogTitle>Assign Roles</DialogTitle>
          <DialogDescription>
            Assign roles to {user.username}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <div className='space-y-2'>
              <FormLabel>Roles</FormLabel>
              <ScrollArea className='h-[250px] rounded-md border p-4'>
                <div className='space-y-3'>
                  {roles.map((role) => (
                    <div
                      key={role.id}
                      className='flex items-start space-x-3'
                    >
                      <Checkbox
                        id={`role-${role.id}`}
                        checked={selectedGroups.includes(role.id)}
                        onCheckedChange={() => toggleGroup(role.id)}
                      />
                      <label
                        htmlFor={`role-${role.id}`}
                        className='text-sm leading-none cursor-pointer'
                      >
                        <div className='font-medium'>{role.name}</div>
                        <div className='text-muted-foreground text-xs'>
                          {role.permissions.length} permission(s)
                        </div>
                      </label>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              {form.formState.errors.groups && (
                <p className='text-sm text-destructive'>
                  {form.formState.errors.groups.message}
                </p>
              )}
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
              <Button
                type='submit'
                disabled={isSubmitting || selectedGroups.length === 0}
              >
                {isSubmitting ? 'Assigning...' : 'Assign Roles'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
