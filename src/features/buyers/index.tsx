import { getRouteApi } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { BuyerService } from '@/services/buyer.service'
import { BuyersDialogs } from './components/buyers-dialogs'
import { BuyersPrimaryButtons } from './components/buyers-primary-buttons'
import { BuyersProvider } from './components/buyers-provider'
import { BuyersTable } from './components/buyers-table'

const route = getRouteApi('/_authenticated/buyers/')

export function Buyers() {
  const search = route.useSearch()
  const navigate = route.useNavigate()

  const { data: buyers = [], isLoading } = useQuery({
    queryKey: ['buyers'],
    queryFn: () => BuyerService.getBuyers(),
  })

  return (
    <BuyersProvider>
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
            <h2 className='text-2xl font-bold tracking-tight'>Buyer Management</h2>
            <p className='text-muted-foreground'>
              Manage your buyers, contacts, and relationships.
            </p>
          </div>
          <BuyersPrimaryButtons />
        </div>
        {isLoading ? (
          <div className='flex items-center justify-center py-10'>
            <p className='text-muted-foreground'>Loading buyers...</p>
          </div>
        ) : (
          <BuyersTable data={buyers} search={search} navigate={navigate} />
        )}
      </Main>

      <BuyersDialogs />
    </BuyersProvider>
  )
}
