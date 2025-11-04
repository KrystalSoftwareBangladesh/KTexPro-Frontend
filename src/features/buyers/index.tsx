import { getRouteApi } from '@tanstack/react-router'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { BuyersDialogs } from './components/buyers-dialogs'
import { BuyersPrimaryButtons } from './components/buyers-primary-buttons'
import { BuyersProvider } from './components/buyers-provider'
import { BuyersTable } from './components/buyers-table'
import { buyers } from './data/buyers'

const route = getRouteApi('/_authenticated/buyers/')

export function Buyers() {
  const search = route.useSearch()
  const navigate = route.useNavigate()

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
        <BuyersTable data={buyers} search={search} navigate={navigate} />
      </Main>

      <BuyersDialogs />
    </BuyersProvider>
  )
}
