import { ICommitDetailsStore, TranslationStore } from '@/views'

import { CommitChanges } from './components/commit-changes'

export interface CommitDiffsViewProps {
  useCommitDetailsStore: () => ICommitDetailsStore
  useTranslationStore: () => TranslationStore
}

export const CommitDiffsView: React.FC<CommitDiffsViewProps> = ({ useCommitDetailsStore, useTranslationStore }) => {
  const { diffs, diffStats } = useCommitDetailsStore()
  return (
    <>
      <p className="text-14 leading-tight text-foreground-4 py-2">
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
    </>
  )
}
