import { useState } from 'react'

import { LabelsListStore } from '@subjects/stores/labels-store'
import { noop } from '@utils/viewUtils'

import { DeleteAlertDialog } from '@harnessio/ui/components'
import { LabelsListPage, SandboxLayout } from '@harnessio/ui/views'

export const ProjectLabelsList = () => {
  const [openAlertDeleteDialog, setOpenAlertDeleteDialog] = useState(false)

  return (
    <SandboxLayout.Content>
      <LabelsListPage
        useLabelsStore={LabelsListStore.useLabelsStore}
        searchQuery={''}
        setSearchQuery={noop}
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
    </SandboxLayout.Content>
  )
}
