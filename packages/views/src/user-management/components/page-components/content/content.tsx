import { useRef } from 'react'

import { Spacer, Text } from '@harnessio/ui/components'
import { useTranslation } from '@harnessio/ui/context'
import { SandboxLayout } from '@views'
import { EmptyState } from '@views/user-management/components/empty-state/empty-state'
import { Actions } from '@views/user-management/components/page-components/actions'
import { UsersList } from '@views/user-management/components/page-components/content/components/users-list'
import { useStates } from '@views/user-management/providers/state-provider'
import { useUserManagementStore } from '@views/user-management/providers/store-provider'

import { ContentProps } from './types'

export const Content = ({ searchQuery, setSearchQuery }: ContentProps) => {
  const { useAdminListUsersStore } = useUserManagementStore()
  const searchRef = useRef<HTMLInputElement | null>(null)

  const { users, totalItems } = useAdminListUsersStore()

  const { loadingStates } = useStates()
  const { isFetchingUsers } = loadingStates

  const { t } = useTranslation()

  if (!isFetchingUsers && !users?.length) {
    return <EmptyState />
  }

  const handleSearchChange = (val: string) => {
    setSearchQuery(val.length ? val : null)
  }

  const handleResetSearch = () => {
    setSearchQuery(null)
    if (searchRef.current) {
      searchRef.current.value = ''
    }
  }

  return (
    <SandboxLayout.Content>
      <Text as="h1" variant="heading-section">
        {t('views:userManagement.usersHeader', 'Users')} <Text as="span">({totalItems || 0})</Text>
      </Text>
      <Spacer size={6} />
      <Actions searchQuery={searchQuery} handleSearchChange={handleSearchChange} ref={searchRef} />
      <Spacer size={4.5} />
      <UsersList searchQuery={searchQuery} handleResetSearch={handleResetSearch} />
    </SandboxLayout.Content>
  )
}
