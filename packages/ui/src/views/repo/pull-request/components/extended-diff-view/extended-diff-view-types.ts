import { DiffFile, DiffViewProps, SplitSide } from '@git-diff-view/react'

export type LinesRange = {
  side: 'old' | 'new'
  start: number
  end: number
}

export interface ExtendedDiffViewProps<T> extends Omit<DiffViewProps<T>, 'extendData' | 'renderWidgetLine'> {
  extendData?: {
    oldFile?: Record<
      string,
      {
        data: T
        fromLine: number
      }
    >
    newFile?: Record<
      string,
      {
        data: T
        fromLine: number
      }
    >
  }
  renderWidgetLine:
    | (({
        diffFile,
        side,
        lineNumber,
        lineFromNumber,
        onClose
      }: {
        lineNumber: number
        lineFromNumber: number
        side: SplitSide
        diffFile: DiffFile
        onClose: () => void
      }) => React.ReactNode)
    | undefined
}
