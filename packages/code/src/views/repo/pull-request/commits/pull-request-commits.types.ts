import { TypesCommit } from '@/views'

export interface IPullRequestCommitsStore {
  // state

  commitsList?: TypesCommit[]
  isFetchingCommits: boolean
  xNextPage: number
  xPrevPage: number
  page: number

  // actions
  setIsFetchingCommits: (loading: boolean) => void
  setCommitList: (data: ListPullReqCommitsOkResponse, headers: Headers | undefined) => void
  setPage: (page: number) => void
}
export declare type ListPullReqCommitsOkResponse = TypesCommit[]
