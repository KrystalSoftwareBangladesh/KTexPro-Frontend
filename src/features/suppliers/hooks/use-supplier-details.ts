import { useQuery } from '@tanstack/react-query'
import { SupplierService } from '@/services/supplier.service'

export function useSupplierDetails(id: number) {
  return useQuery({
    queryKey: ['supplier', id],
    queryFn: () => SupplierService.getSupplierById(id),
    enabled: !!id,
  })
}
