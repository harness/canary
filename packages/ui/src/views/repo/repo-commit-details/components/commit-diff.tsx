import { useTranslation } from '@/context'
import { formatNumber } from '@/utils'
import { ICommitDetailsStore } from '@/views'

import { CommitChanges } from './commit-changes'

export interface CommitDiffsViewProps {
  useCommitDetailsStore: () => ICommitDetailsStore
}

export const CommitDiff: React.FC<CommitDiffsViewProps> = ({ useCommitDetailsStore }) => {
  const { t } = useTranslation()
  const { diffs, diffStats } = useCommitDetailsStore()

  return (
    <div className="min-h-[calc(100vh-var(--cn-page-nav-height))] pt-5">
      <p className="mb-3.5 text-2 leading-tight text-cn-foreground-2">
        {t('views:commits.commitDetailsDiffShowing', 'Showing')}{' '}
        <span className="text-cn-foreground-accent">
          {formatNumber(diffStats?.files_changed ?? 0)}{' '}
          {t('views:commits.commitDetailsDiffChangedFiles', 'changed files')}
        </span>{' '}
        {t('views:commits.commitDetailsDiffWith', 'with')} {formatNumber(diffStats?.additions ?? 0)}{' '}
        {t('views:commits.commitDetailsDiffAdditionsAnd', 'additions and')} {formatNumber(diffStats?.deletions ?? 0)}{' '}
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
          filePath: item.filePath,
          isDeleted: item.isDeleted,
          unchangedPercentage: item.unchangedPercentage,
          isBinary: item.isBinary
        }))}
        diffMode={2}
      />
    </div>
  )
}
