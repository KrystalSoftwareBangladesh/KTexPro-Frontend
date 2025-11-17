import { useQuery } from '@tanstack/react-query'
import { styleService } from '@/services/style.service'
import type { StyleFilters } from '@/types/style'

export function useStyles(filters?: StyleFilters) {
  return useQuery({
    queryKey: ['styles', filters],
    queryFn: () => styleService.getStyles(filters),
  })
}
