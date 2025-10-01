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
}

const BranchCompareBanner: FC<BranchCompareBannerProps> = ({ branch, defaultBranchName, repoId, spaceId }) => {
  const { t } = useTranslation()
  const { Link: RouterLink } = useRouterContext()

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
      <Button variant="primary" theme="success" asChild>
        <RouterLink
          to={`${spaceId ? `/${spaceId}` : ''}/repos/${repoId}/pulls/compare/${defaultBranchName}...${branch.name}`}
        >
          {t('views:repos.compareAndPullRequest', 'Compare & pull request')}
        </RouterLink>
      </Button>
    </Layout.Flex>
  )
}

export default BranchCompareBanner
