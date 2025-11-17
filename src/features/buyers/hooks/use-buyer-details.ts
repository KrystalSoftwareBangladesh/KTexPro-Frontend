import { useQuery } from '@tanstack/react-query'
import { BuyerService } from '@/services/buyer.service'

export function useBuyerDetails(id: number) {
  return useQuery({
    queryKey: ['buyer', id],
    queryFn: () => BuyerService.getBuyerById(id),
    enabled: !!id,
  })
}
