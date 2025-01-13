import { DiffFileEntry, TranslationStore, TypesDiffStats } from '@/views'

import { CommitChanges } from './commit-changes'

export interface CommitDiffsViewProps {
  diffs: DiffFileEntry[]
  diffStats?: TypesDiffStats
  useTranslationStore: () => TranslationStore
}

export const CommitDiff: React.FC<CommitDiffsViewProps> = ({ diffs, diffStats, useTranslationStore }) => {
  return (
    <div className="min-h-[calc(100vh-100px)] pl-6 pt-5">
      <p className="text-14 text-foreground-4 py-2 leading-tight">
        Showing <span className="text-foreground-accent">{diffStats?.files_changed || 0} changed files </span>
        with {diffStats?.additions || 0} additions and {diffStats?.deletions || 0} deletions
      </p>
      <CommitChanges
        data={
          diffs?.map(item => ({
            text: item.filePath,
            numAdditions: item.addedLines,
            numDeletions: item.deletedLines,
            data: item.raw,
            title: item.filePath,
            lang: item.filePath.split('.')[1],
            fileViews: item.fileViews,
            checksumAfter: item.checksumAfter,
            filePath: item.filePath
          })) || []
        }
        useTranslationStore={useTranslationStore}
        diffMode={2}
      />
    </div>
  )
}
