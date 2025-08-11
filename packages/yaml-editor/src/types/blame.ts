export interface BlameItem {
  fromLineNumber: number
  toLineNumber: number
  commitInfo?: BlameItemCommit
  infoContent?: JSX.Element
}

export interface BlameItemCommit {
  sha?: string
  title?: string
  author?: BlameItemCommitAuthor
}

export interface BlameItemCommitAuthor {
  identity?: {
    name?: string
    email?: string
  }
  when: string
  avatarUrl?: string
  initials?: string
}
