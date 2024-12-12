import { FC, useCallback } from 'react'

import { PullRequestList, PullRequestPageProps } from '@harnessio/ui/views'

import { noop, useTranslationsStore } from '../../utils.ts'
import { pullRequestListStore } from './pull-request-list-store.ts'

const PullRequestListWrapper: FC<Partial<PullRequestPageProps>> = props => {
  const usePullRequestListStore = useCallback(
    () => ({
      ...pullRequestListStore,
      setPage: noop
    }),
    []
  )

  return (
    <PullRequestList
      setSearchQuery={noop}
      usePullRequestStore={usePullRequestListStore}
      useTranslationStore={useTranslationsStore}
      isLoading={false}
      {...props}
    />
  )
}

export default PullRequestListWrapper
