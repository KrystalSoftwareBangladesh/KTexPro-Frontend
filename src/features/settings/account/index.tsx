import { ContentSection } from '../components/content-section'
import { AccountForm } from './account-form'

export function SettingsAccount() {
  return (
    <ContentSection
      title='Account'
      desc='Manage your account password and security settings.'
    >
      <AccountForm />
    </ContentSection>
  )
}
