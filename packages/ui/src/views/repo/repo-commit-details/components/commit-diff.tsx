import { ICommitDetailsStore, TranslationStore } from '@/views'

import { CommitChanges } from './commit-changes'

export interface CommitDiffsViewProps {
  useCommitDetailsStore: () => ICommitDetailsStore
  useTranslationStore: () => TranslationStore
}

export const CommitDiff: React.FC<CommitDiffsViewProps> = ({ useCommitDetailsStore, useTranslationStore }) => {
  const { t } = useTranslationStore()
  const { diffs, diffStats } = useCommitDetailsStore()

  return (
    <div className="min-h-[calc(100vh-100px)] pl-6 pt-5">
      <p className="mb-3.5 text-14 leading-tight text-foreground-4">
        {t('views:commits.commitDetailsDiffShowing', 'Showing')}{' '}
        <span className="text-foreground-accent">
          {diffStats?.files_changed || 0} {t('views:commits.commitDetailsDiffChangedFiles', 'changed files')}
        </span>
        {t('views:commits.commitDetailsDiffWith', 'with')} {diffStats?.additions || 0}{' '}
        {t('views:commits.commitDetailsDiffAdditionsAnd', 'additions and')} {diffStats?.deletions || 0}{' '}
        {t('views:commits.commitDetailsDiffDeletions', 'deletions')}
      </p>
      <CommitChanges
        data={diffs.map(item => ({
          text: item.filePath,
          numAdditions: item.addedLines,
          numDeletions: item.deletedLines,
          data: item.raw,
          title: item.filePath,
          lang: item.filePath.split('.')[1],
          fileViews: item.fileViews,
          checksumAfter: item.checksumAfter,
          filePath: item.filePath
        }))}
        useTranslationStore={useTranslationStore}
        diffMode={2}
      />
    </div>
  )
}
