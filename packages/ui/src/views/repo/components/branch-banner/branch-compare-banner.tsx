import { FC } from 'react'

import { Button, IconV2, TimeAgoCard } from '@/components'
import { useRouterContext, useTranslation } from '@/context'
import { TypesBranchTable } from '@/views'

export interface BranchInfo {
  name: string
  lastPushedAt: string | Date
}

interface BranchCompareBannerProps {
  branch: TypesBranchTable
  defaultBranchName?: string
  repoId?: string
  spaceId?: string
  onDismiss?: (branchName: string) => void
}

const BranchCompareBanner: FC<BranchCompareBannerProps> = ({
  branch,
  defaultBranchName,
  repoId,
  spaceId,
  onDismiss
}) => {
  const { t } = useTranslation()
  const { Link } = useRouterContext()

  const handleDismiss = () => {
    if (onDismiss && branch.name) {
      onDismiss(branch.name)
    }
  }

  return (
    <div className="flex items-center justify-between px-4 py-3">
      <div className="flex items-center gap-x-2">
        <IconV2 name="git-branch" size="xs" className="text-success-9" />
        <span className="text-2 font-medium text-cn-foreground-1">{branch.name}</span>
        <span className="text-2 text-cn-foreground-2">
          {t('views:repos.hadRecentPushes', 'had recent pushes')}{' '}
          <TimeAgoCard
            timestamp={branch.updated}
            textProps={{ variant: 'body-strong', color: 'foreground-3', truncate: true }}
          />
        </span>
      </div>
      <div className="flex items-center gap-x-2">
        <Button variant="primary" asChild>
          <Link
            to={`${spaceId ? `/${spaceId}` : ''}/repos/${repoId}/pulls/compare/${defaultBranchName}...${branch.name}`}
          >
            {t('views:repos.compareAndPullRequest', 'Compare & pull request')}
          </Link>
        </Button>
        <Button
          size="sm"
          variant="ghost"
          iconOnly
          onClick={handleDismiss}
          aria-label={t('views:repos.dismiss', 'Dismiss')}
          title={t('views:repos.dismiss', 'Dismiss')}
        >
          <IconV2 name="xmark" size="xs" />
        </Button>
      </div>
    </div>
  )
}

export default BranchCompareBanner
