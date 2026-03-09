import { useState } from 'react'

import { LabelsListStore } from '@subjects/stores/labels-store'
import { noop } from '@utils/viewUtils'

import { DeleteAlertDialog } from '@harnessio/ui/components'
import { LabelsListPage } from '@harnessio/views'

export const RepoLabelsList = () => {
  const [openAlertDeleteDialog, setOpenAlertDeleteDialog] = useState(false)

  return (
    <>
      <LabelsListPage
        useLabelsStore={LabelsListStore.useLabelsStore}
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
      />
    </>
  )
}
