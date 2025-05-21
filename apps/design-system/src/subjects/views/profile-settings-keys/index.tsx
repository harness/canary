import { useState } from 'react'

import { noop } from '@utils/viewUtils'

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
        isLoadingTokenList={false}
        isLoadingKeysList={false}
      />
      <ProfileSettingsTokenCreateDialog
        open={isTokenDialogOpen}
        onClose={() => setIsTokenDialogOpen(false)}
        handleCreateToken={noop}
        error={null}
        isLoading={false}
        useProfileSettingsStore={mockProfileSettingsStore}
      />
      <ProfileSettingsKeysCreateDialog
        open={isKeysDialogOpen}
        onClose={() => setIsKeysDialogOpen(false)}
        handleCreateSshKey={noop}
        error={null}
      />
      <DeleteAlertDialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        deleteFn={noop}
        error={null}
        isLoading={false}
      />
    </>
  )
}
