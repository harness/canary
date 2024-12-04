import { useState } from 'react'

import { CreatePipelinePage } from '@harnessio/views'

import CreatePipelineDialog from './PipelineCreateDialog/PipelineCreateDialog'

export function PipelineCreate() {
  const [isCreatePipelineDialogOpen, setCreatePipelineDialogOpen] = useState(false)

  const closeSearchDialog = () => {
    setCreatePipelineDialogOpen(false)
  }

  return (
    <>
      <CreatePipelineDialog open={isCreatePipelineDialogOpen} onClose={closeSearchDialog} />
      <CreatePipelinePage onClickStartFromScratch={() => setCreatePipelineDialogOpen(true)} />
    </>
  )
}
