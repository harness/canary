import { useState } from 'react'

import { noop, useTranslationStore } from '@utils/viewUtils'

import { DeleteAlertDialog } from '@harnessio/ui/components'
import {
  ProfileSettingsKeysCreateDialog,
  ProfileSettingsTokenCreateDialog,
  SettingsAccountKeysPage
} from '@harnessio/ui/views'

import { mockProfileSettingsStore } from '../profile-settings/profile-settings-store'

export const ProfileSettingsKeysView = () => {
  const [isTokenDialogOpen, setIsTokenDialogOpen] = useState(false)
  const [isKeysDialogOpen, setIsKeysDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  return (
    <>
      <SettingsAccountKeysPage
        useProfileSettingsStore={mockProfileSettingsStore}
        openTokenDialog={() => setIsTokenDialogOpen(true)}
        openSshKeyDialog={() => setIsKeysDialogOpen(true)}
        openAlertDeleteDialog={() => setIsDeleteDialogOpen(true)}
        error={null}
        useTranslationStore={useTranslationStore}
        isLoadingTokenList={false}
        isLoadingKeysList={false}
      />
      <ProfileSettingsTokenCreateDialog
        open={isTokenDialogOpen}
        onClose={() => setIsTokenDialogOpen(false)}
        handleCreateToken={noop}
        error={null}
        isLoading={false}
        useTranslationStore={useTranslationStore}
        useProfileSettingsStore={mockProfileSettingsStore}
      />
      <ProfileSettingsKeysCreateDialog
        open={isKeysDialogOpen}
        onClose={() => setIsKeysDialogOpen(false)}
        handleCreateSshKey={noop}
        error={null}
        useTranslationStore={useTranslationStore}
      />
      <DeleteAlertDialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        deleteFn={noop}
        error={null}
        isLoading={false}
        useTranslationStore={useTranslationStore}
      />
    </>
  )
}
