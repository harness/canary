import { CommitSelectorListItem } from '@views/repo/pull-request'
import { TypesCommit, TypesListCommitResponse } from '@views/repo/repo-commits'

export interface ICommitSelectorStore {
  commits: TypesCommit[] | null
  totalPages: number
  setCommits: (data: TypesListCommitResponse, headers: Headers | undefined) => void
  page: number
  setPage: (page: number) => void
  selectedCommit: CommitSelectorListItem
}
