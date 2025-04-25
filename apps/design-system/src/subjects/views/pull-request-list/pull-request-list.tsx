import { FC, useCallback } from 'react'

import { noop, useTranslationStore } from '@utils/viewUtils'

import { PullRequestListPage, PullRequestPageProps } from '@harnessio/ui/views'

import { LabelsListStore } from './../../stores/labels-store'
import { pullRequestListStore } from './pull-request-list-store'

const PullRequestListWrapper: FC<Partial<PullRequestPageProps>> = props => {
  const usePullRequestListStore = useCallback(
    () => ({
      ...pullRequestListStore
    }),
    []
  )

  return (
    <PullRequestListPage
      setSearchQuery={noop}
      useLabelsStore={LabelsListStore.useLabelsStore}
      usePullRequestListStore={usePullRequestListStore}
      useTranslationStore={useTranslationStore}
      isLoading={false}
      {...props}
    />
  )
}

export default PullRequestListWrapper
