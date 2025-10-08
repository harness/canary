import { FC, useCallback } from 'react'

import { noop } from '@utils/viewUtils'

import { RepoListPageProps, SandboxRepoListPage } from '@harnessio/ui/views'

import repoListStore from './repo-list-store.json'

const RepoListWrapper: FC<Partial<RepoListPageProps>> = props => {
  const useRepoListStore = useCallback(
    () => ({
      ...repoListStore,
      totalItems: 100,
      pageSize: 10,
      setPaginationFromHeaders: (_?: Headers) => {},
      importToastId: '',
      setImportToastId: noop,
      updateRepository: noop,
      setPage: noop,
      setPageSize: noop,
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
        isLoading={false}
        isError={false}
        searchQuery=""
        setSearchQuery={noop}
        setQueryPage={noop}
        onFavoriteToggle={noop}
        onFilterChange={noop}
        onSortChange={noop}
        scope={{
          accountId: 'account-id'
        }}
        {...props}
      />
    </>
  )
}

export default RepoListWrapper
