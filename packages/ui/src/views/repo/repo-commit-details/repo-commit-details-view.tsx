import { FC } from 'react'

import { Avatar, Button, CommitCopyActions, Layout, Skeleton, Text, TimeAgoCard } from '@/components'
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
  showSidebar?: boolean
  loadingCommitDetails?: boolean
}

export const RepoCommitDetailsView: FC<RepoCommitDetailsViewProps> = ({
  useCommitDetailsStore,
  showSidebar = true,
  toCommitDetails,
  toPullRequest,
  toCode,
  loadingCommitDetails = false
}) => {
  const { Outlet, Link } = useRouterContext()
  const { t } = useTranslation()
  const { commitData } = useCommitDetailsStore()

  return (
    <SandboxLayout.Main className="overflow-visible" fullWidth>
      {loadingCommitDetails ? (
        <SandboxLayout.Content>
          <Skeleton.List />
        </SandboxLayout.Content>
      ) : (
        <SandboxLayout.Content>
          <Layout.Horizontal gap="3xs">
            <Text variant="heading-section">{t('views:commits.commitDetailsTitle', 'Commit')}</Text>
            <Text variant="heading-section" color="foreground-2">
              {commitData?.sha?.slice(0, 7)}
            </Text>
          </Layout.Horizontal>

          <div className="mt-4 rounded-md border border-cn-borders-2">
            <div className="flex items-center justify-between rounded-t-md border-b border-cn-borders-2 bg-cn-background-2 px-4 py-3">
              <CommitTitleWithPRLink
                toPullRequest={toPullRequest}
                commitMessage={commitData?.title}
                title={commitData?.title}
                textClassName={'text-14 font-medium leading-snug'}
                // textVariant={'body-normal'}
              />
              <Button variant="outline" asChild>
                <Link to={toCode?.({ sha: commitData?.sha || '' }) || ''}>
                  {t('views:commits.browseFiles', 'Browse files')}
                </Link>
              </Button>
            </div>
            <div className="flex items-center justify-between px-4 py-2.5">
              <div className="gap-cn-2xs flex items-center">
                {commitData?.author?.identity?.name && (
                  <Avatar name={commitData?.author?.identity?.name} size="md" rounded />
                )}
                <Text variant="body-single-line-strong">{commitData?.author?.identity?.name || ''}</Text>
                <Text variant="body-single-line-normal" color="foreground-3">
                  committed on{' '}
                  <TimeAgoCard
                    timestamp={commitData?.author?.when}
                    dateTimeFormatOptions={{ dateStyle: 'medium' }}
                    textProps={{ color: 'foreground-4' }}
                  />
                </Text>
              </div>
              <CommitCopyActions toCommitDetails={toCommitDetails} sha={commitData?.sha || ''} />
            </div>
          </div>
          {!showSidebar && <Outlet />}
        </SandboxLayout.Content>
      )}
      {showSidebar && (
        <SandboxLayout.Content className="border-cn-borders-4 mt-5 grid grid-cols-[auto_1fr] border-t py-0 pl-0 pr-5">
          <Outlet />
        </SandboxLayout.Content>
      )}
    </SandboxLayout.Main>
  )
}
