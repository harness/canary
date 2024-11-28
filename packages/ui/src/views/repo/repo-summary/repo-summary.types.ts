export enum SummaryItemType {
  Folder = 0,
  File = 1
}

export interface UserProps {
  name: string
  avatarUrl?: string
}

export interface FileProps {
  id: string
  type: SummaryItemType
  name: string
  lastCommitMessage: string
  timestamp: string
  user?: UserProps
  sha?: string
  path: string
}
