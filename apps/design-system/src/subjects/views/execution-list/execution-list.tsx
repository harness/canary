import { FC } from 'react'

import { noop } from '@utils/viewUtils'

import { ExecutionListPage, RepoSummaryViewProps } from '@harnessio/views'

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
