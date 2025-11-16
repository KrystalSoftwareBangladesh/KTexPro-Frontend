import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { SupplierService } from '@/services/supplier.service'
import type { SupplierFormData } from '@/features/suppliers/data/schema'

export const SUPPLIERS_QUERY_KEY = 'suppliers'

export function useSuppliersQuery(params?: {
  page?: number
  page_size?: number
  search?: string
  status?: string
  country?: string
}) {
  return useQuery({
    queryKey: [SUPPLIERS_QUERY_KEY, params],
    queryFn: () => SupplierService.getSuppliers(params),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  })
}

export function useSupplierQuery(id: number | undefined) {
  return useQuery({
    queryKey: [SUPPLIERS_QUERY_KEY, id],
    queryFn: () => SupplierService.getSupplierById(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  })
}

export function useCreateSupplierMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      data,
      capabilityIds,
    }: {
      data: SupplierFormData
      capabilityIds: number[]
    }) => SupplierService.createSupplier(data, capabilityIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SUPPLIERS_QUERY_KEY] })
      toast.success('Supplier created successfully')
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to create supplier'
      toast.error(message)
    },
  })
}

export function useUpdateSupplierMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      data,
      capabilityIds,
    }: {
      id: number
      data: Partial<SupplierFormData>
      capabilityIds?: number[]
    }) => SupplierService.updateSupplier(id, data, capabilityIds),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [SUPPLIERS_QUERY_KEY] })
      queryClient.invalidateQueries({ queryKey: [SUPPLIERS_QUERY_KEY, variables.id] })
      toast.success('Supplier updated successfully')
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to update supplier'
      toast.error(message)
    },
  })
}

export function useDeleteSupplierMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => SupplierService.deleteSupplier(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SUPPLIERS_QUERY_KEY] })
      toast.success('Supplier deleted successfully')
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to delete supplier'
      toast.error(message)
    },
  })
}

export function useCapabilityTypesQuery() {
  return useQuery({
    queryKey: ['capability-types'],
    queryFn: () => SupplierService.getCapabilityTypes(),
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
  })
}

export function useCreateCapabilityTypeMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (name: string) => SupplierService.createCapabilityType(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['capability-types'] })
      toast.success('Capability type created successfully')
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to create capability type'
      toast.error(message)
    },
  })
}

export function useUpdateCapabilityTypeMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, name }: { id: number; name: string }) =>
      SupplierService.updateCapabilityType(id, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['capability-types'] })
      toast.success('Capability type updated successfully')
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to update capability type'
      toast.error(message)
    },
  })
}

export function useDeleteCapabilityTypeMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => SupplierService.deleteCapabilityType(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['capability-types'] })
      toast.success('Capability type deleted successfully')
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to delete capability type'
      toast.error(message)
    },
  })
}
