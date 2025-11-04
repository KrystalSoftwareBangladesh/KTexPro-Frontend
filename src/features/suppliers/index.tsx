import { getRouteApi } from '@tanstack/react-router'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { SuppliersDialogs } from './components/suppliers-dialogs'
import { SuppliersPrimaryButtons } from './components/suppliers-primary-buttons'
import { SuppliersProvider } from './components/suppliers-provider'
import { SuppliersTable } from './components/suppliers-table'
import { suppliers } from './data/suppliers'

const route = getRouteApi('/_authenticated/suppliers/')

export function Suppliers() {
  const search = route.useSearch()
  const navigate = route.useNavigate()

  return (
    <SuppliersProvider>
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
            <h2 className='text-2xl font-bold tracking-tight'>Supplier Management</h2>
            <p className='text-muted-foreground'>
              Manage your suppliers, factory partners, and production relationships.
            </p>
          </div>
          <SuppliersPrimaryButtons />
        </div>
        <SuppliersTable data={suppliers} search={search} navigate={navigate} />
      </Main>

      <SuppliersDialogs />
    </SuppliersProvider>
  )
}
