import { FC } from 'react'

import { Button, IconV2, Layout, Text, TimeAgoCard } from '@/components'
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
    <Layout.Flex justify="between" align="center" className="px-4 py-3" gap="sm">
      <Layout.Flex gap="xs" align="center">
        <IconV2 name="git-branch" size="sm" className="text-icons-success" />
        <Text variant="body-strong" color="foreground-1">
          <Link to={`${spaceId ? `/${spaceId}` : ''}/repos/${repoId}/summary/refs/heads/${branch.name}`}>
            {branch.name}
          </Link>
        </Text>
        <Text variant="body-single-line-normal" color="foreground-2">
          {t('views:repos.hadRecentPushes', 'had recent pushes ')}
          <TimeAgoCard
            timestamp={branch.updated}
            textProps={{ variant: 'body-single-line-normal', color: 'foreground-2', truncate: true }}
          />
        </Text>
      </Layout.Flex>
      <Layout.Flex gap="xs" align="center">
        <Button variant="primary" asChild>
          <Link
            to={`${spaceId ? `/${spaceId}` : ''}/repos/${repoId}/pulls/compare/${defaultBranchName}...${branch.name}`}
          >
            {t('views:repos.compareAndPullRequest', 'Compare & pull request')}
          </Link>
        </Button>
        <Button
          size="xs"
          variant="ghost"
          iconOnly
          onClick={handleDismiss}
          aria-label={t('views:repos.dismiss', 'Dismiss')}
          title={t('views:repos.dismiss', 'Dismiss')}
        >
          <IconV2 name="xmark" size="xs" />
        </Button>
      </Layout.Flex>
    </Layout.Flex>
  )
}

export default BranchCompareBanner
