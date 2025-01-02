import { FC } from 'react'
import { Link } from 'react-router-dom'

import { ExecutionListPage, RepoSummaryViewProps, TLinkComponent } from '@harnessio/ui/views'

import { noop, useTranslationsStore } from '../../utils.ts'
import { useExecutionListStore } from './execution-list.store.ts'

const LinkComponent: TLinkComponent = ({ to, children }) => <Link to={to}>{children}</Link>

const ExecutionListWrapper: FC<Partial<RepoSummaryViewProps>> = () => {
  return (
    <ExecutionListPage
      useExecutionListStore={useExecutionListStore}
      useTranslationStore={useTranslationsStore}
      setSearchQuery={noop}
      isLoading={false}
      isError={false}
      LinkComponent={LinkComponent}
      handleExecutePipeline={noop}
    />
  )
}

export default ExecutionListWrapper