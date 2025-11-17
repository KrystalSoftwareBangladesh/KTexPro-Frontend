import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { styleService } from '@/services/style.service'
import type {
  CreateStyleInput,
  StyleStatusTransitionInput,
  UpdateStyleInput,
} from '@/types/style'

export function useCreateStyle() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateStyleInput) => styleService.createStyle(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['styles'] })
      toast.success('Style created successfully')
    },
    onError: () => {
      toast.error('Failed to create style')
    },
  })
}

export function useUpdateStyle() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateStyleInput }) =>
      styleService.updateStyle(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['styles'] })
      queryClient.invalidateQueries({ queryKey: ['style', variables.id] })
      toast.success('Style updated successfully')
    },
    onError: () => {
      toast.error('Failed to update style')
    },
  })
}

export function useDeleteStyle() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => styleService.deleteStyle(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['styles'] })
      toast.success('Style deleted successfully')
    },
    onError: () => {
      toast.error('Failed to delete style')
    },
  })
}

export function useStyleStatusTransition() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number
      data: StyleStatusTransitionInput
    }) => styleService.transitionStatus(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['styles'] })
      queryClient.invalidateQueries({ queryKey: ['style', variables.id] })
      toast.success('Status updated successfully')
    },
    onError: () => {
      toast.error('Failed to update status')
    },
  })
}
