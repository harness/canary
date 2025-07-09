import { RepositoryType } from '@views/repo/repo.types'

export interface RepoStore {
  repositories: RepositoryType[] | null
  totalItems: number
  pageSize: number
  page: number
  importRepoIdentifier: string | null
  importToastId: string | null

  setImportToastId: (id: string | null) => void
  setPage: (page: number) => void
  setRepositories: (data: RepositoryType[], totalItems: number, pageSize: number) => void
  updateRepository: (repo: RepositoryType) => void
  setImportRepoIdentifier: (identifier: string | null) => void
  addRepository: (repo: RepositoryType) => void
}

export interface RoutingProps {
  toRepository: (repo: RepositoryType) => string
  toCreateRepo: () => string
  toImportRepo: () => string
  toImportMultipleRepos: () => string
}

/**
 * RoutingProps made optional for usage in apps/design-system
 */
export interface RepoListProps extends Partial<RoutingProps> {
  useRepoStore: () => RepoStore
  isLoading: boolean
  isError: boolean
  errorMessage?: string
  searchQuery?: string | null
  setSearchQuery: (query: string | null) => void
  setQueryPage: (page: number) => void
}
