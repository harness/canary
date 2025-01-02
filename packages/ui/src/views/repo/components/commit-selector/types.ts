import { CommitSelectorListItem, TypesCommit, TypesListCommitResponse } from '@/views'

export interface ICommitSelectorStore {
  commits: TypesCommit[] | null
  totalPages: number
  setCommits: (data: TypesListCommitResponse, headers: Headers | undefined) => void
  page: number
  setPage: (page: number) => void
  selectedCommit: CommitSelectorListItem
}
