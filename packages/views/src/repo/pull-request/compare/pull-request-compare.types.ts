import { DiffFileEntry } from '../details/pull-request-details-types'

export interface HeaderProps {
  text: string
  data?: string
  title: string
  lang: string
  addedLines?: number
  deletedLines?: number
  isBinary?: boolean
  isDeleted: boolean
  unchangedPercentage?: number
  filePath: string
  diffData: DiffFileEntry
}
