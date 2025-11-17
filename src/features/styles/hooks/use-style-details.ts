import { useQuery } from '@tanstack/react-query'
import { styleService } from '@/services/style.service'

export function useStyleDetails(id: number) {
  return useQuery({
    queryKey: ['style', id],
    queryFn: () => styleService.getStyleById(id),
    enabled: !!id,
  })
}
