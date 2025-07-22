import { FC, useState } from 'react'

import { TypesBranchTable } from '@/views'

import BranchCompareBanner from './branch-compare-banner'

interface BranchCompareBannerListProps {
  defaultBranchName: string
  prCandidateBranches?: TypesBranchTable[]
  repoId?: string
  spaceId?: string
}

export const BranchCompareBannerList: FC<BranchCompareBannerListProps> = ({
  defaultBranchName,
  prCandidateBranches,
  repoId,
  spaceId
}) => {
  const [dismissedBranches, setDismissedBranches] = useState<string[]>([])

  const handleDismiss = (branchName: string) => {
    setDismissedBranches(prev => [...prev, branchName])
  }
  const visibleCandidates = prCandidateBranches?.filter(
    candidate => candidate.name && !dismissedBranches.includes(candidate.name)
  )
  if (!visibleCandidates?.length) {
    return null
  }
  return (
    <div className="rounded-md border border-cn-borders-2 bg-cn-background-2 mb-4 overflow-hidden">
      <div>
        {visibleCandidates?.map((branch, index) => (
          <div key={branch.name} className="relative">
            <BranchCompareBanner
              branch={branch}
              defaultBranchName={defaultBranchName}
              repoId={repoId}
              spaceId={spaceId}
              onDismiss={handleDismiss}
            />
            {index < visibleCandidates.length - 1 && <div className="mx-4 border-b border-cn-borders-2"></div>}
          </div>
        ))}
      </div>
    </div>
  )
}

export default BranchCompareBannerList
