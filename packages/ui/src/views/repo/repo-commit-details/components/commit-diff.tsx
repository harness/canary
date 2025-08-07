import { ChangedFilesShortInfo, ICommitDetailsStore } from '@/views'
import { Layout } from '@components/layout'

import { CommitChanges } from './commit-changes'

export interface CommitDiffsViewProps {
  useCommitDetailsStore: () => ICommitDetailsStore
}

export const CommitDiff: React.FC<CommitDiffsViewProps> = ({ useCommitDetailsStore }) => {
  const { diffs, diffStats } = useCommitDetailsStore()

  return (
    <Layout.Flex direction="column" className="w-full pb-cn-xl min-h-[calc(100vh-var(--cn-page-nav-height))]" gapY="sm">
      {/* TODO: add goToDiff handler */}
      <ChangedFilesShortInfo diffData={diffs} diffStats={diffStats} goToDiff={() => {}} />

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
    </Layout.Flex>
  )
}
