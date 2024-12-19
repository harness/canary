import { FC, useCallback } from 'react'

import { noop, useTranslationsStore } from '@utils/viewUtils.ts'

import { PullRequestList, PullRequestPageProps } from '@harnessio/ui/views'

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
      usePullRequestListStore={usePullRequestListStore}
      useTranslationStore={useTranslationsStore}
      isLoading={false}
      {...props}
    />
  )
}

export default PullRequestListWrapper
