import { useState } from 'react'

import { LabelsListStore } from '@subjects/stores/labels-store'
import { noop } from '@utils/viewUtils'

import { DeleteAlertDialog } from '@harnessio/ui/components'
import { LabelsListPage } from '@harnessio/ui/views'

export const RepoLabelsList = () => {
  const [openAlertDeleteDialog, setOpenAlertDeleteDialog] = useState(false)

  return (
    <>
      <LabelsListPage
        className="max-w-[772px] px-0"
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
      />
    </>
  )
}
