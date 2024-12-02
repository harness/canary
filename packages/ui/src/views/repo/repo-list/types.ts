import { TFunction } from 'i18next'

export interface RepositoryType {
  id: number
  name: string
  description?: string
  private: boolean
  stars: number
  forks: number
  pulls: number
  createdAt: number
  timestamp: string
  importing?: boolean
}

interface RepoStore {
  repositories: RepositoryType[] | null
  totalPages: number
  page: number
  setPage: (page: number) => void
}

export interface RepoListProps {
  useRepoStore: () => RepoStore
  t: TFunction
}
