/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { toast } from 'sonner'
import { Loader2, ChevronLeft, ChevronRight, Plus, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Stepper } from '@/components/ui/stepper'

import { UserService } from '@/services/user.service'
import { RoleService } from '@/services/role.service'

// ---------------------- Schema ----------------------
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

export type CreateUserFormData = z.infer<typeof createUserSchema>

// ---------------------- UI ----------------------
const STEPS = [
  { id: 'basic', title: 'Basic Info', description: 'Name & contact' },
  { id: 'credentials', title: 'Credentials', description: 'Login details' },
  { id: 'roles', title: 'Roles', description: 'Assign access' },
]

interface CreateUserDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function CreateUserDrawer({ open, onOpenChange, onSuccess }: CreateUserDrawerProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  // Fetch roles
  const { data: roles = [], isLoading: rolesLoading } = useQuery({
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

  // Reset form when drawer opens/closes
  useEffect(() => {
    if (open) {
      form.reset({
        first_name: '',
        middle_name: '',
        last_name: '',
        email: '',
        username: '',
        password: '',
        confirm_password: '',
        groups: [],
      })
      setCurrentStep(0)
    }
  }, [open])

  const selectedRoleBadges = useMemo(() => {
    return (form.watch('groups') || []).map((id) => {
      const role = roles.find((r: any) => r.id === id)
      return { id, name: role?.name ?? `Role ${id}` }
    })
  }, [form.watch('groups'), roles])

  const getFieldsForStep = (step: number): (keyof CreateUserFormData | string)[] => {
    switch (step) {
      case 0:
        return ['first_name', 'middle_name', 'last_name', 'email', 'username']
      case 1:
        return ['password', 'confirm_password']
      case 2:
        return ['groups']
      default:
        return []
    }
  }

  const handleNext = async () => {
    const fields = getFieldsForStep(currentStep)
    const valid = await form.trigger(fields as any)
    if (valid && currentStep < STEPS.length - 1) setCurrentStep((s) => s + 1)
  }

  const handlePrevious = () => setCurrentStep((s) => (s > 0 ? s - 1 : s))

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
          // Common backends: {message} or DRF/FastAPI: {detail}
          (error.response?.data as any)?.message ||
          (error.response?.data as any)?.detail ||
          'Failed to create user'
        toast.error(errorMessage)
      } else {
        toast.error('An error occurred. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = (isOpen: boolean) => {
    if (!isOpen) onOpenChange(false)
  }

  // ---------------------- Render ----------------------
  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent className="flex w-full flex-col gap-0 p-0 sm:max-w-2xl md:max-w-3xl lg:max-w-4xl">
        <SheetHeader className="space-y-4 border-b p-6 pb-4">
          <div className="space-y-1 text-start">
            <SheetTitle>Create User</SheetTitle>
            <SheetDescription>Fill in the details to add a new user</SheetDescription>
          </div>
          <Stepper steps={STEPS} currentStep={currentStep} />
        </SheetHeader>

        <Form {...form}>
          <form
            id="create-user-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex-1 overflow-y-auto px-6 py-4"
          >
            {/* Step 0: Basic Info */}
            {currentStep === 0 && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium">Basic Information</h3>
                  <p className="text-sm text-muted-foreground">Name & contact details</p>
                </div>
                <Separator />

                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="first_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="John" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="last_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="middle_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Middle Name</FormLabel>
                      <FormControl>
                        <Input placeholder="(Optional)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email *</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="john.doe@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username *</FormLabel>
                        <FormControl>
                          <Input placeholder="johndoe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            )}

            {/* Step 1: Credentials */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium">Credentials</h3>
                  <p className="text-sm text-muted-foreground">Set a secure password</p>
                </div>
                <Separator />

                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password *</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirm_password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password *</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            )}

            {/* Step 2: Roles */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium">Assign Roles</h3>
                  <p className="text-sm text-muted-foreground">Choose at least one role to grant access</p>
                </div>
                <Separator />

                {rolesLoading ? (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="size-4 animate-spin" /> Loading roles...
                  </div>
                ) : (
                  <FormField
                    control={form.control}
                    name="groups"
                    render={({ field }) => (
                      <FormItem>
                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                          {roles.map((role: any) => (
                            <div
                              key={role.id}
                              className="flex items-start gap-3 rounded-md border p-3"
                            >
                              <Checkbox
                                checked={field.value?.includes(role.id)}
                                onCheckedChange={(checked) => {
                                  const current = field.value ?? []
                                  if (checked) field.onChange([...current, role.id])
                                  else field.onChange(current.filter((id: number) => id !== role.id))
                                }}
                              />
                              <div className="space-y-1">
                                <FormLabel className="cursor-pointer font-normal">
                                  {role.name}
                                </FormLabel>
                                {role.description && (
                                  <p className="text-xs text-muted-foreground">{role.description}</p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                        <FormMessage />

                        {/* Selected badges */}
                        {(field.value?.length ?? 0) > 0 && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {selectedRoleBadges.map((r) => (
                              <Badge key={r.id} variant="secondary" className="gap-1">
                                {r.name}
                                <button
                                  type="button"
                                  aria-label={`Remove ${r.name}`}
                                  className="ml-1 inline-flex"
                                  onClick={() =>
                                    field.onChange((field.value ?? []).filter((id: number) => id !== r.id))
                                  }
                                >
                                  <X className="size-3" />
                                </button>
                              </Badge>
                            ))}
                          </div>
                        )}
                      </FormItem>
                    )}
                  />
                )}

                {/* Quick-add field (optional) - allows admin to paste a role ID */}
                <div className="hidden items-center gap-2">
                  <Input placeholder="Role ID" />
                  <Button type="button" variant="outline" size="sm">
                    <Plus className="mr-2 size-4" /> Add by ID
                  </Button>
                </div>
              </div>
            )}
          </form>
        </Form>

        <SheetFooter className="flex-row justify-between gap-2 border-t p-6 pt-4">
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={handlePrevious} disabled={currentStep === 0}>
              <ChevronLeft className="mr-1 size-4" /> Previous
            </Button>
          </div>

          <div className="flex gap-2">
            <SheetClose asChild>
              <Button type="button" variant="ghost" disabled={isLoading}>
                Cancel
              </Button>
            </SheetClose>

            {currentStep < STEPS.length - 1 ? (
              <Button type="button" onClick={handleNext} disabled={isLoading}>
                Next <ChevronRight className="ml-1 size-4" />
              </Button>
            ) : (
              <Button form="create-user-form" type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 size-4 animate-spin" />} Create User
              </Button>
            )}
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
