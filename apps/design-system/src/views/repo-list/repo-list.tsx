import { FC, useCallback } from 'react'

import { RepoListProps, SandboxRepoListPage } from '@harnessio/ui/views'

import { noop, useTranslationsStore } from '../../utils.ts'
import repoListStore from './repo-list-store.json'

const RepoListWrapper: FC<Partial<RepoListProps>> = props => {
  const useRepoListStore = useCallback(
    () => ({
      ...repoListStore,
      setPage: noop,
      setRepositories: noop
    }),
    []
  )

  return (
    <SandboxRepoListPage
      useRepoStore={useRepoListStore}
      useTranslationStore={useTranslationsStore}
      isLoading={false}
      isError={false}
      searchQuery=""
      setSearchQuery={noop}
      {...props}
    />
  )
}

export default RepoListWrapper
