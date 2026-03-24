import { TypesCommit } from '@views'

export interface IPullRequestCommitsStore {
  // state

  commitsList?: TypesCommit[]
  isFetchingCommits: boolean

  // actions
  setIsFetchingCommits: (loading: boolean) => void
  setCommitList: (data: ListPullReqCommitsOkResponse) => void
}
export declare type ListPullReqCommitsOkResponse = TypesCommit[]
