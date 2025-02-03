export interface HeaderProps {
  text: string
  data?: string
  title: string
  lang: string
  addedLines?: number
  removedLines?: number
  isBinary?: boolean
  isDeleted?: boolean
  unchangedPercentage?: number
  filePath?: string
}
