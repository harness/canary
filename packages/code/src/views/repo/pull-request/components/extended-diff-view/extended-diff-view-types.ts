import { DiffFile, DiffViewProps, SplitSide } from '@git-diff-view/react'

export type Side = 'old' | 'new'

export type SideWithBoth = Side | 'both'

export type LinesRange = {
  side: Side
  start: number
  end: number
  startSide?: SideWithBoth
  endSide?: SideWithBoth
}

export interface ExtendedDiffViewProps<T> extends Omit<DiffViewProps<T>, 'extendData' | 'renderWidgetLine'> {
  scopeMultilineSelectionToOneHunk?: (lineRange: LinesRange) => LinesRange
  scopeMultilineSelectionToOneBlockAndOneSide?: (
    start: { old?: number; new?: number },
    end: { old?: number; new?: number }
  ) => LinesRange
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
        lineSide,
        lineFromSide,
        onClose
      }: {
        lineNumber: number
        lineFromNumber: number
        lineSide?: SideWithBoth
        lineFromSide?: SideWithBoth
        side: SplitSide
        diffFile: DiffFile
        onClose: () => void
      }) => React.ReactNode)
    | undefined
}
