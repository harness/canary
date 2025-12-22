import { FC, useState } from 'react'

import { TypesBranchTable } from '@/views'
import { Layout } from '@components/layout'
import { Separator } from '@components/separator'

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
    <Layout.Grid
      className="rounded-cn-3 border-cn-success-outline bg-cn-success-outline px-cn-md py-cn-sm overflow-hidden border"
      gap="sm"
    >
      {visibleCandidates?.map((branch, index) => (
        <>
          <BranchCompareBanner
            branch={branch}
            defaultBranchName={defaultBranchName}
            repoId={repoId}
            spaceId={spaceId}
            onDismiss={handleDismiss}
          />
          {index < visibleCandidates.length - 1 && <Separator className="bg-cn-success-primary" />}
        </>
      ))}
    </Layout.Grid>
  )
}

export default BranchCompareBannerList
