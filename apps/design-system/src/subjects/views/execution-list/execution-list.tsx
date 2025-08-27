import { FC } from 'react'
import { Link } from 'react-router-dom'

import { noop } from '@utils/viewUtils'

import { ExecutionListPage, RepoSummaryViewProps, TLinkComponent } from '@harnessio/ui/views'

import { useExecutionListStore } from './execution-list.store'

const ExecutionListWrapper: FC<Partial<RepoSummaryViewProps>> = () => {
  return (
    <ExecutionListPage
      useExecutionListStore={useExecutionListStore}
      setSearchQuery={noop}
      isLoading={false}
      isError={false}
      handleExecutePipeline={noop}
    />
  )
}

export default ExecutionListWrapper
