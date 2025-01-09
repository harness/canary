import { DiffFileEntry, SandboxLayout, TranslationStore, TypesCommit, TypesDiffStats } from '@/views'

import { CommitChanges } from './components/commit-changes'

interface CommitDetails extends TypesCommit {
  isVerified?: boolean
  diffs: DiffFileEntry[]
  diffStats?: TypesDiffStats
}

export interface CommitDiffsViewProps {
  commit: CommitDetails
  useTranslationStore: () => TranslationStore
}

export const CommitDiffsView: React.FC<CommitDiffsViewProps> = ({ commit, useTranslationStore }) => {
  return (
    <>
      <p className="text-14 leading-tight text-foreground-4 py-2">
        Showing <span className="text-foreground-accent">{commit?.diffStats?.files_changed || 0} changed files </span>
        with {commit?.diffStats?.additions || 0} additions and {commit?.diffStats?.deletions || 0} deletions
      </p>
      <CommitChanges
        data={
          commit.diffs?.map(item => ({
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
