import { FC } from 'react'

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
  return (
    <Layout.Grid
      className="rounded-3 border-cn-success bg-cn-success-outline px-cn-md py-cn-sm overflow-hidden border"
      gap="sm"
    >
      {prCandidateBranches?.map((branch, index) => (
        <>
          <BranchCompareBanner
            branch={branch}
            defaultBranchName={defaultBranchName}
            repoId={repoId}
            spaceId={spaceId}
          />
          {index < prCandidateBranches.length - 1 && <Separator className="bg-cn-success-primary" />}
        </>
      ))}
    </Layout.Grid>
  )
}

export default BranchCompareBannerList
