import { ComboBoxOptions } from '@components/filters/filters-bar/actions/variants/combo-box'
import { RepositoryType } from '@views/repo/repo.types'

import { Scope } from '../..'

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

export interface FavoriteProps {
  onFavoriteToggle: ({ repoId, isFavorite }: { repoId: number; isFavorite: boolean }) => void
}

export type RepoListFilters = {
  favorite?: boolean
  recursive?: ComboBoxOptions
}

export interface FilterProps {
  onFilterChange: (filters: RepoListFilters) => void
}

export interface SortProps {
  onSortChange: (sortValues: string) => void
}

/**
 * RoutingProps made optional for usage in apps/design-system
 */
export interface RepoListPageProps extends Partial<RoutingProps>, FavoriteProps, FilterProps, SortProps {
  useRepoStore: () => RepoStore
  isLoading: boolean
  isError: boolean
  errorMessage?: string
  searchQuery?: string | null
  setSearchQuery: (query: string | null) => void
  setQueryPage: (page: number) => void
  scope: Scope
}

export enum RepoSortMethod {
  Identifier = 'identifier,desc',
  Newest = 'created,desc',
  Oldest = 'created,asc',
  LastPush = 'last_git_push,desc'
}
