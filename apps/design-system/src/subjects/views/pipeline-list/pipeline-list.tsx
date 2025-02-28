import { FC, useState } from 'react'
import { Link } from 'react-router-dom'

import { noop, useTranslationStore } from '@utils/viewUtils'

import { CreatePipelineDialog, PipelineListPage, RepoSummaryViewProps, TLinkComponent } from '@harnessio/ui/views'

import { usePipelineListStore } from './pipeline-list.store'

const LinkComponent: TLinkComponent = ({ to, children }) => <Link to={to}>{children}</Link>

const PipelineListWrapper: FC<Partial<RepoSummaryViewProps>> = () => {
  const [createPipelineOpen, setCreatePipelineOpen] = useState(false)
  return (
    <>
      <PipelineListPage
        usePipelineListStore={usePipelineListStore}
        useTranslationStore={useTranslationStore}
        setSearchQuery={noop}
        isLoading={false}
        isError={false}
        handleCreatePipeline={() => setCreatePipelineOpen(true)}
        LinkComponent={LinkComponent}
      />
      <CreatePipelineDialog
        isOpen={createPipelineOpen}
        useTranslationStore={useTranslationStore}
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
