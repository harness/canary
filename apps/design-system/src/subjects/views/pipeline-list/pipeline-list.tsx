import { FC, useState } from 'react'

import { noop } from '@utils/viewUtils'

import { CreatePipelineDialog, PipelineListPage, RepoSummaryViewProps } from '@harnessio/ui/views'

import { usePipelineListStore } from './pipeline-list.store'

const PipelineListWrapper: FC<Partial<RepoSummaryViewProps>> = () => {
  const [createPipelineOpen, setCreatePipelineOpen] = useState(false)
  return (
    <>
      <PipelineListPage
        usePipelineListStore={usePipelineListStore}
        setSearchQuery={noop}
        isLoading={false}
        isError={false}
        handleCreatePipeline={() => setCreatePipelineOpen(true)}
      />
      <CreatePipelineDialog
        isOpen={createPipelineOpen}
        onClose={() => setCreatePipelineOpen(false)}
        onSubmit={() => {
          setCreatePipelineOpen(false)
          return new Promise(() => undefined)
        }}
        onCancel={() => setCreatePipelineOpen(false)}
        useCreatePipelineStore={() => ({
          isLoadingBranchNames: false,
          branchNames: ['main', 'branch1', 'branch2'],
          defaultBranch: 'main',
          setBranchesState: noop,
          setError: noop
        })}
      />
    </>
  )
}

export default PipelineListWrapper
