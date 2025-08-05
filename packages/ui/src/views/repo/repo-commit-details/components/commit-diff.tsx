import { Text } from '@/components'
import { useTranslation } from '@/context'
import { formatNumber } from '@/utils'
import { ICommitDetailsStore } from '@/views'
import { Layout } from '@components/layout'

import { CommitChanges } from './commit-changes'

export interface CommitDiffsViewProps {
  useCommitDetailsStore: () => ICommitDetailsStore
}

export const CommitDiff: React.FC<CommitDiffsViewProps> = ({ useCommitDetailsStore }) => {
  const { t } = useTranslation()
  const { diffs, diffStats } = useCommitDetailsStore()

  return (
    <Layout.Grid className="pb-cn-xl min-h-[calc(100vh-var(--cn-page-nav-height))]" gapY="sm">
      <Text variant="body-single-line-normal">
        {t('views:commits.commitDetailsDiffShowing', 'Showing')}{' '}
        <Text color="accent" as="span">
          {formatNumber(diffStats?.files_changed ?? 0)}{' '}
          {t('views:commits.commitDetailsDiffChangedFiles', 'changed files')}
        </Text>{' '}
        {t('views:commits.commitDetailsDiffWith', 'with')} {formatNumber(diffStats?.additions ?? 0)}{' '}
        {t('views:commits.commitDetailsDiffAdditionsAnd', 'additions and')} {formatNumber(diffStats?.deletions ?? 0)}{' '}
        {t('views:commits.commitDetailsDiffDeletions', 'deletions')}
      </Text>

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
    </Layout.Grid>
  )
}
