import { FC, useCallback } from 'react'

import { noop, useTranslationStore } from '@utils/viewUtils'

import { RepoListProps, SandboxRepoListPage } from '@harnessio/ui/views'

import repoListStore from './repo-list-store.json'

const RepoListWrapper: FC<Partial<RepoListProps>> = props => {
  const useRepoListStore = useCallback(
    () => ({
      ...repoListStore,
      importToastId: null,
      setImportToastId: noop,
      updateRepository: noop,
      setPage: noop,
      setRepositories: noop,
      importRepoIdentifier: null,
      setImportRepoIdentifier: noop,
      addRepository: noop
    }),
    []
  )

  return (
    <>
      <SandboxRepoListPage
        useRepoStore={useRepoListStore}
        useTranslationStore={useTranslationStore}
        isLoading={false}
        isError={false}
        searchQuery=""
        setSearchQuery={noop}
        {...props}
      />
    </>
  )
}

export default RepoListWrapper
