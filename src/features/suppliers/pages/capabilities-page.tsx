import { useState } from 'react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ConfigDrawer } from '@/components/config-drawer'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Button } from '@/components/ui/button'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  useCapabilityTypesQuery,
  useCreateCapabilityTypeMutation,
  useUpdateCapabilityTypeMutation,
  useDeleteCapabilityTypeMutation,
} from '../hooks/use-suppliers-query'
import type { CapabilityType } from '@/services/supplier.service'

export function CapabilitiesPage() {
  const { data, isLoading, error } = useCapabilityTypesQuery()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [editingCapability, setEditingCapability] = useState<CapabilityType | null>(null)
  const [deletingCapability, setDeletingCapability] = useState<CapabilityType | null>(null)
  const [name, setName] = useState('')

  const createMutation = useCreateCapabilityTypeMutation()
  const updateMutation = useUpdateCapabilityTypeMutation()
  const deleteMutation = useDeleteCapabilityTypeMutation()

  const handleOpenAddDialog = () => {
    setEditingCapability(null)
    setName('')
    setIsDialogOpen(true)
  }

  const handleOpenEditDialog = (capability: CapabilityType) => {
    setEditingCapability(capability)
    setName(capability.name)
    setIsDialogOpen(true)
  }

  const handleOpenDeleteDialog = (capability: CapabilityType) => {
    setDeletingCapability(capability)
    setIsDeleteDialogOpen(true)
  }

  const handleSave = () => {
    if (!name.trim()) return

    if (editingCapability) {
      updateMutation.mutate(
        { id: editingCapability.id, name: name.trim() },
        {
          onSuccess: () => {
            setIsDialogOpen(false)
            setName('')
            setEditingCapability(null)
          },
        }
      )
    } else {
      createMutation.mutate(name.trim(), {
        onSuccess: () => {
          setIsDialogOpen(false)
          setName('')
        },
      })
    }
  }

  const handleDelete = () => {
    if (!deletingCapability) return

    deleteMutation.mutate(deletingCapability.id, {
      onSuccess: () => {
        setIsDeleteDialogOpen(false)
        setDeletingCapability(null)
      },
    })
  }

  return (
    <>
      <Header fixed>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Capability Types</h2>
            <p className='text-muted-foreground'>
              Manage production capabilities and processes for suppliers.
            </p>
          </div>
          <Button onClick={handleOpenAddDialog}>
            <Plus className='opacity-60' size={18} strokeWidth={2} aria-hidden='true' />
            Add Capability Type
          </Button>
        </div>

        {isLoading ? (
          <div className='flex items-center justify-center p-8'>
            <p className='text-muted-foreground'>Loading capability types...</p>
          </div>
        ) : error ? (
          <div className='flex items-center justify-center p-8'>
            <p className='text-destructive'>Failed to load capability types. Please try again.</p>
          </div>
        ) : (
          <div className='rounded-md border'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className='text-right'>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data && data.length > 0 ? (
                  data.map((capability) => (
                    <TableRow key={capability.id}>
                      <TableCell className='font-medium'>{capability.id}</TableCell>
                      <TableCell>{capability.name}</TableCell>
                      <TableCell className='text-right'>
                        <div className='flex justify-end gap-2'>
                          <Button
                            variant='ghost'
                            size='sm'
                            onClick={() => handleOpenEditDialog(capability)}
                          >
                            <Pencil className='h-4 w-4' />
                          </Button>
                          <Button
                            variant='ghost'
                            size='sm'
                            onClick={() => handleOpenDeleteDialog(capability)}
                          >
                            <Trash2 className='h-4 w-4' />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className='h-24 text-center'>
                      No capability types found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </Main>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingCapability ? 'Edit Capability Type' : 'Add Capability Type'}
            </DialogTitle>
            <DialogDescription>
              {editingCapability
                ? 'Update the capability type name.'
                : 'Create a new capability type for suppliers.'}
            </DialogDescription>
          </DialogHeader>
          <div className='grid gap-4 py-4'>
            <div className='grid gap-2'>
              <Label htmlFor='name'>Name</Label>
              <Input
                id='name'
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder='e.g., Knitting, Dyeing, Sewing'
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSave()
                  }
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!name.trim() || createMutation.isPending || updateMutation.isPending}
            >
              {createMutation.isPending || updateMutation.isPending ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the capability type &quot;{deletingCapability?.name}&quot;.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={deleteMutation.isPending}>
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
