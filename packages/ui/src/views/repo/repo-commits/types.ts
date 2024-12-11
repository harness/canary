export interface TypesCommit {
  author?: TypesSignature
  committer?: TypesSignature
  message?: string
  parent_shas?: string[]
  sha?: string
  stats?: TypesCommitStats
  title?: string
}

export interface TypesSignature {
  identity?: TypesIdentity
  when?: string
}

export interface TypesCommitStats {
  files?: TypesCommitFileStats[]
  total?: TypesChangeStats
}

export interface TypesIdentity {
  email?: string
  name?: string
}

export interface TypesCommitFileStats {
  changes?: number
  deletions?: number
  insertions?: number
  old_path?: string
  path?: string
  status?: string
}

export interface TypesChangeStats {
  changes?: number
  deletions?: number
  insertions?: number
}

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
