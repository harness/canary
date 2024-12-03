export interface GitCommitFormType {
  message: string
  description?: string
  commitToGitRef: string
  newBranchName?: string
  fileName?: string
}

export enum CommitToGitRefOption {
  DIRECTLY = 'directly',
  NEW_BRANCH = 'new-branch'
}
