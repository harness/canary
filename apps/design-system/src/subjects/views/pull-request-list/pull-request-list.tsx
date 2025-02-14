import { FC, useCallback } from 'react'

import { useThemeStore } from '@utils/theme-utils.ts'
import { noop, useTranslationsStore } from '@utils/viewUtils'

import { PullRequestListPage, PullRequestPageProps } from '@harnessio/ui/views'

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
      usePullRequestListStore={usePullRequestListStore}
      useTranslationStore={useTranslationsStore}
      isLoading={false}
      useThemeStore={useThemeStore}
      {...props}
    />
  )
}

export default PullRequestListWrapper
