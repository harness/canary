import { z } from 'zod'

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

export const formSchema = z.object({
  title: z.string().min(1, { message: 'Please provide a pull request title' }),
  description: z.string().min(1, { message: 'Please provide a description' })
})
export type FormFields = z.infer<typeof formSchema> // Automatically generate a type from the schema
export interface TypesDiffStats {
  additions?: number | null
  commits?: number | null
  deletions?: number | null
  files_changed?: number | null
}
export interface TypesCommit {
  author?: TypesSignature
  committer?: TypesSignature
  message?: string
  parent_shas?: string[]
  sha?: string
  stats?: TypesCommitStats
  title?: string
}
export interface TypesCommitStats {
  files?: TypesCommitFileStats[]
  total?: TypesChangeStats
}

export interface TypesChangeStats {
  changes?: number
  deletions?: number
  insertions?: number
}
export interface TypesCommitFileStats {
  changes?: number
  deletions?: number
  insertions?: number
  old_path?: string
  path?: string
  status?: string
}
export interface TypesSignature {
  identity?: TypesIdentity
  when?: string
}
export interface TypesIdentity {
  email?: string
  name?: string
}
