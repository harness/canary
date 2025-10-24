import { useEffect, useState } from 'react'

import { noop, useTranslationStore } from '@utils/viewUtils'

import { SettingsAccountGeneralPage } from '@harnessio/ui/views'

import { mockProfileSettingsStore } from './profile-settings-store.ts'

export const ProfileSettingsView = () => {
  const [isLoadingUser, setIsLoadingUser] = useState(true)

  useEffect(() => {
    setIsLoadingUser(false)
  }, [])

  return (
    <SettingsAccountGeneralPage
      useProfileSettingsStore={mockProfileSettingsStore}
      useTranslationStore={useTranslationStore}
      isLoadingUser={isLoadingUser}
      isUpdatingUser={false}
      isUpdatingPassword={false}
      error={null}
      onUpdateUser={noop}
      onUpdatePassword={noop}
      profileUpdateSuccess={false}
      passwordUpdateSuccess={false}
    />
  )
}
