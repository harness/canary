import { useState } from 'react'

import { LabelsListStore } from '@subjects/stores/labels-store'
import { noop, useTranslationStore } from '@utils/viewUtils'

import { DeleteAlertDialog } from '@harnessio/ui/components'
import { LabelsListPage } from '@harnessio/ui/views'

export const RepoLabelsList = () => {
  const [openAlertDeleteDialog, setOpenAlertDeleteDialog] = useState(false)

  return (
    <>
      <LabelsListPage
        className="max-w-[570px] px-0"
        useTranslationStore={useTranslationStore}
        useLabelsStore={LabelsListStore.useLabelsStore}
        createdIn={''}
        searchQuery={''}
        setSearchQuery={noop}
        isRepository
        labelsListViewProps={{ handleEditLabel: noop, handleDeleteLabel: () => setOpenAlertDeleteDialog(true) }}
      />
      <DeleteAlertDialog
        open={openAlertDeleteDialog}
        onClose={() => setOpenAlertDeleteDialog(false)}
        identifier={''}
        type="label"
        deleteFn={noop}
        isLoading={false}
        useTranslationStore={useTranslationStore}
      />
    </>
  )
}
