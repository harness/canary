import { FC } from 'react'
import { Link } from 'react-router-dom'

import { PipelineListPage, RepoSummaryViewProps, TLinkComponent } from '@harnessio/ui/views'

import { noop, useTranslationsStore } from '../../utils.ts'
import { usePipelineListStore } from './pipeline-list.store.ts'

const LinkComponent: TLinkComponent = ({ to, children }) => <Link to={to}>{children}</Link>

const PipelineListWrapper: FC<Partial<RepoSummaryViewProps>> = () => {
  return (
    <PipelineListPage
      usePipelineListStore={usePipelineListStore}
      useTranslationStore={useTranslationsStore}
      setSearchQuery={noop}
      isLoading={false}
      isError={false}
      handleCreatePipeline={noop}
      LinkComponent={LinkComponent}
    />
  )
}

export default PipelineListWrapper
