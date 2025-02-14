import { FC, useCallback } from 'react'

import { useThemeStore } from '@utils/theme-utils.ts'
import { noop, useTranslationsStore } from '@utils/viewUtils'

import { RepoListProps, SandboxRepoListPage } from '@harnessio/ui/views'

import repoListStore from './repo-list-store.json'

const RepoListWrapper: FC<Partial<RepoListProps>> = props => {
  const useRepoListStore = useCallback(
    () => ({
      ...repoListStore,
      setPage: noop,
      setRepositories: noop,
      importRepoIdentifier: null,
      setImportRepoIdentifier: noop,
      addRepository: noop
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
      useThemeStore={useThemeStore}
      {...props}
    />
  )
}

export default RepoListWrapper
