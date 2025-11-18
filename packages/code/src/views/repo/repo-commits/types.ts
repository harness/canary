import { TypesCommit } from '@/views'

export interface TypesListCommitResponse {
  commits?: TypesCommit[] | null
  rename_details?: TypesRenameDetails[] | null
  total_commits?: number
}

export interface TypesRenameDetails {
  commit_sha_after?: string
  commit_sha_before?: string
  new_path?: string
  old_path?: string
}
