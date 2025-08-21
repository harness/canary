import { FC } from 'react'

import { Avatar, Button, CommitCopyActions, IconV2, Layout, Skeleton, Text, TimeAgoCard } from '@/components'
import { useRouterContext, useTranslation } from '@/context'
import { ICommitDetailsStore, SandboxLayout } from '@/views'

import { CommitTitleWithPRLink } from '../components/CommitTitleWithPRLink'

interface RoutingProps {
  toCommitDetails?: ({ sha }: { sha: string }) => string
  toPullRequest?: ({ pullRequestId }: { pullRequestId: number }) => string
  toCode?: ({ sha }: { sha: string }) => string
}
export interface RepoCommitDetailsViewProps extends RoutingProps {
  useCommitDetailsStore: () => ICommitDetailsStore
  loadingCommitDetails?: boolean
}

export const RepoCommitDetailsView: FC<RepoCommitDetailsViewProps> = ({
  useCommitDetailsStore,
  toCommitDetails,
  toPullRequest,
  toCode,
  loadingCommitDetails = false
}) => {
  const { Outlet, Link } = useRouterContext()
  const { t } = useTranslation()
  const { commitData } = useCommitDetailsStore()

  if (loadingCommitDetails) {
    return (
      <SandboxLayout.Main fullWidth>
        <SandboxLayout.Content>
          <Skeleton.List />
        </SandboxLayout.Content>
      </SandboxLayout.Main>
    )
  }

  return (
    <SandboxLayout.Main fullWidth>
      <SandboxLayout.Content className="gap-0 pb-0">
        <Layout.Grid gapY="md">
          <Text variant="heading-section" as="h2">
            {t('views:commits.commitDetailsTitle', 'Commit')}&nbsp;
            <Text variant="heading-section" color="foreground-3" as="span">
              {commitData?.sha?.substring(0, 7)}
            </Text>
          </Text>

          <div className="border-cn-borders-3 rounded-3 overflow-hidden border">
            <Layout.Grid
              flow="column"
              justify="between"
              align="center"
              className="border-cn-borders-3 bg-cn-background-2 px-cn-md py-cn-sm border-b"
              gapX="md"
            >
              <CommitTitleWithPRLink
                toPullRequest={toPullRequest}
                commitMessage={commitData?.title}
                title={commitData?.title}
                textProps={{ variant: 'body-code' }}
              />

              <Button variant="outline" asChild>
                <Link to={toCode?.({ sha: commitData?.sha || '' }) || ''}>
                  <IconV2 name="folder" />
                  {t('views:commits.browseFiles', 'Browse Files')}
                </Link>
              </Button>
            </Layout.Grid>

            <Layout.Flex align="center" justify="between" className="px-cn-md py-cn-sm">
              {commitData?.author?.identity?.name && commitData?.author?.when && (
                <Layout.Flex align="center" gapX="2xs">
                  <Avatar name={commitData.author.identity.name} rounded />
                  <Text variant="body-single-line-strong" color="foreground-1">
                    {commitData.author.identity.name}
                  </Text>
                  <Text variant="body-single-line-normal">
                    {t('views:commits.commitDetailsAuthored', 'authored')}{' '}
                    <TimeAgoCard
                      timestamp={new Date(commitData.author.when).getTime()}
                      cutoffDays={3}
                      beforeCutoffPrefix=""
                      afterCutoffPrefix="on"
                    />
                  </Text>
                </Layout.Flex>
              )}

              <CommitCopyActions toCommitDetails={toCommitDetails} sha={commitData?.sha || ''} />
            </Layout.Flex>
          </div>
        </Layout.Grid>

        <Outlet />
      </SandboxLayout.Content>
    </SandboxLayout.Main>
  )
}
