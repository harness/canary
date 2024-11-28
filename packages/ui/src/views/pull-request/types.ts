export interface PullRequestType {
  is_draft?: boolean
  merged?: number | null // TODO: Should merged really be all these??
  name?: string
  number?: number
  sha?: string
  author?: string
  reviewRequired: boolean
  tasks?: number
  source_branch?: string
  timestamp: string
  comments?: number
  state?: string
  labels?: {
    text: string
    color: string
  }[]
}
export type IconType = 'pr-open' | 'pr-closed' | 'pr-draft' | 'pr-merge'

export interface PullRequestStore {
  pullRequests: PullRequestType[] | null
  totalPages: number
  page: number
  setPage: (page: number) => void
}
export interface RepoRepositoryOutput {
  num_closed_pulls?: number
  num_open_pulls?: number
}
