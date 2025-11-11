import { Control } from 'react-hook-form'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import type { Role } from '@/types/auth'

interface ContactPersonFieldsProps {
  control: Control<any>
  index: number
  roles: Role[]
  rolesLoading: boolean
}

export function ContactPersonFields({
  control,
  index,
  roles,
  rolesLoading,
}: ContactPersonFieldsProps) {
  return (
    <div className='space-y-4'>
      {/* Name Fields */}
      <div className='grid gap-4 sm:grid-cols-1 md:grid-cols-3'>
        <FormField
          control={control}
          name={`contact_persons.${index}.first_name`}
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
          control={control}
          name={`contact_persons.${index}.middle_name`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Middle Name</FormLabel>
              <FormControl>
                <Input placeholder='M.' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={`contact_persons.${index}.last_name`}
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

      {/* Email and Username */}
      <div className='grid gap-4 sm:grid-cols-1 md:grid-cols-2'>
        <FormField
          control={control}
          name={`contact_persons.${index}.email`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email *</FormLabel>
              <FormControl>
                <Input type='email' placeholder='john.doe@example.com' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={`contact_persons.${index}.username`}
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
      </div>

      {/* Password Fields */}
      <div className='grid gap-4 sm:grid-cols-1 md:grid-cols-2'>
        <FormField
          control={control}
          name={`contact_persons.${index}.password`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password *</FormLabel>
              <FormControl>
                <Input type='password' placeholder='********' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={`contact_persons.${index}.confirm_password`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password *</FormLabel>
              <FormControl>
                <Input type='password' placeholder='********' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Roles */}
      <FormField
        control={control}
        name={`contact_persons.${index}.groups`}
        render={() => (
          <FormItem>
            <div className='mb-4'>
              <FormLabel>Roles *</FormLabel>
            </div>
            {rolesLoading ? (
              <p className='text-sm text-muted-foreground'>Loading roles...</p>
            ) : (
              <div className='grid gap-3 sm:grid-cols-2 md:grid-cols-3'>
                {roles.map((role) => (
                  <FormField
                    key={role.id}
                    control={control}
                    name={`contact_persons.${index}.groups`}
                    render={({ field }) => (
                      <FormItem
                        key={role.id}
                        className='flex flex-row items-start space-x-3 space-y-0'
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(role.id)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...(field.value || []), role.id])
                                : field.onChange(
                                    field.value?.filter((value: number) => value !== role.id)
                                  )
                            }}
                          />
                        </FormControl>
                        <Label className='font-normal cursor-pointer'>
                          {role.name}
                        </Label>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            )}
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
