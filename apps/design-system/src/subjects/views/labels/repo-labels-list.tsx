import { useState } from 'react'

import { noop, useTranslationsStore } from '@utils/viewUtils'

import { DeleteAlertDialog } from '@harnessio/ui/components'
import { CreateLabelDialog, RepoLabelsListView } from '@harnessio/ui/views'

import { RepoLabelsListStore } from './repo-labels-store'

export const RepoLabelsList = () => {
  const [openCreateLabelDialog, setOpenCreateLabelDialog] = useState(false)
  const [openAlertDeleteDialog, setOpenAlertDeleteDialog] = useState(false)

  return (
    <>
      <RepoLabelsListView
        useLabelsStore={RepoLabelsListStore.useLabelsStore}
        useTranslationStore={useTranslationsStore}
        handleDeleteLabel={() => setOpenAlertDeleteDialog(true)}
        handleEditLabel={() => setOpenCreateLabelDialog(true)}
        openCreateLabelDialog={() => setOpenCreateLabelDialog(true)}
        searchQuery={null}
        setSearchQuery={noop}
        isLoadingSpaceLabels={false}
      />
      <CreateLabelDialog
        open={openCreateLabelDialog}
        onClose={() => setOpenCreateLabelDialog(false)}
        onSubmit={noop}
        useTranslationStore={useTranslationsStore}
        isCreatingLabel={false}
        error={''}
        useLabelsStore={RepoLabelsListStore.useLabelsStore}
      />
      <DeleteAlertDialog
        open={openAlertDeleteDialog}
        onClose={() => setOpenAlertDeleteDialog(false)}
        identifier={''}
        type="label"
        deleteFn={noop}
        isLoading={false}
        useTranslationStore={useTranslationsStore}
      />
    </>
  )
}
