import { FC } from 'react'

import { Button, IconV2, Layout, Link, Text, TimeAgoCard } from '@/components'
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
  const { Link: RouterLink } = useRouterContext()

  const handleDismiss = () => {
    if (onDismiss && branch.name) {
      onDismiss(branch.name)
    }
  }

  return (
    <Layout.Flex justify="between" align="center" gap="sm">
      <Layout.Grid gap="2xs" align="center" flow="column">
        <IconV2 name="git-branch" size="sm" color="success" />
        <Link
          to={`${spaceId ? `/${spaceId}` : ''}/repos/${repoId}/summary/refs/heads/${branch.name}`}
          className="font-body-strong text-cn-1 inline-block w-auto truncate"
        >
          {branch.name}
        </Link>
        <Text wrap="nowrap">
          {t('views:repos.hadRecentPushes', 'had recent pushes ')}
          <TimeAgoCard timestamp={branch.updated} textProps={{ color: 'foreground-2', truncate: true }} />
        </Text>
      </Layout.Grid>
      <Layout.Flex gap="xs" align="center">
        <Button variant="primary" theme="success" asChild>
          <RouterLink
            to={`${spaceId ? `/${spaceId}` : ''}/repos/${repoId}/pulls/compare/${defaultBranchName}...${branch.name}`}
          >
            {t('views:repos.compareAndPullRequest', 'Compare & pull request')}
          </RouterLink>
        </Button>
        <Button
          size="xs"
          variant="ghost"
          iconOnly
          onClick={handleDismiss}
          aria-label={t('views:repos.dismiss', 'Dismiss')}
          title={t('views:repos.dismiss', 'Dismiss')}
          tooltipProps={{
            content: t('views:repos.dismiss', 'Dismiss')
          }}
        >
          <IconV2 name="xmark" size="xs" />
        </Button>
      </Layout.Flex>
    </Layout.Flex>
  )
}

export default BranchCompareBanner
