import { RepositoryType } from '@views/repo/repo.types'
import i18n, { TFunction } from 'i18next'

export interface RepoStore {
  repositories: RepositoryType[] | null
  totalPages: number
  page: number
  setPage: (page: number) => void
  setRepositories: (data: RepositoryType[], totalPages: number) => void
}

export interface TranslationStore {
  t: TFunction
  i18n: typeof i18n
  changeLanguage: (lng: string) => void
}

export interface RepoListProps {
  useRepoStore: () => RepoStore
  useTranslationStore: () => TranslationStore
  isLoading: boolean
  isError: boolean
  errorMessage?: string
  searchQuery?: string | null
  setSearchQuery: (query: string | null) => void
}
