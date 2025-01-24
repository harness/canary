import { useState } from 'react'

import { LabelsListStore } from '@subjects/stores/labels-store'
import { noop, useTranslationsStore } from '@utils/viewUtils'

import { DeleteAlertDialog } from '@harnessio/ui/components'
import { LabelsListPage } from '@harnessio/ui/views'

export const RepoLabelsList = () => {
  const [openAlertDeleteDialog, setOpenAlertDeleteDialog] = useState(false)

  return (
    <>
      <LabelsListPage
        useTranslationStore={useTranslationsStore}
        useLabelsStore={LabelsListStore.useLabelsStore}
        createdIn={''}
        handleEditLabel={() => {}}
        handleDeleteLabel={() => setOpenAlertDeleteDialog(true)}
        searchQuery={''}
        setSearchQuery={() => {}}
        isLoading={false}
        isRepository
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
