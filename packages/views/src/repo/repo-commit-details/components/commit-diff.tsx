import { DiffModeEnum } from '@git-diff-view/react'
import { ICommitDetailsStore } from '@views'

import { Layout } from '@harnessio/ui/components'

import { CommitChanges } from './commit-changes'
import { CommitDiffFilter } from './commit-diff-filter'

export interface CommitDiffsViewProps {
  useCommitDetailsStore: () => ICommitDetailsStore
  diffMode: DiffModeEnum
  setDiffMode: (mode: DiffModeEnum) => void
  toRepoFileDetails?: ({ path }: { path: string }) => string
}

export const CommitDiff: React.FC<CommitDiffsViewProps> = ({
  useCommitDetailsStore,
  diffMode,
  setDiffMode,
  toRepoFileDetails
}) => {
  const { diffs, diffStats, commitSHA } = useCommitDetailsStore()

  return (
    <Layout.Flex direction="column" className="pb-cn-lg pt-cn-xl w-full" gapY="sm">
      {/* TODO: add goToDiff handler */}
      <CommitDiffFilter
        diffMode={diffMode}
        setDiffMode={setDiffMode}
        diffData={diffs}
        diffStats={diffStats}
        goToDiff={() => {}}
      />

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
        diffMode={diffMode}
        toRepoFileDetails={toRepoFileDetails}
        commitSHA={commitSHA}
      />
    </Layout.Flex>
  )
}
