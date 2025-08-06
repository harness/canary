import { FC } from 'react'

import { Avatar, Button, CommitCopyActions, Text, TimeAgoCard } from '@/components'
import { useRouterContext, useTranslation } from '@/context'
import { ICommitDetailsStore, SandboxLayout } from '@/views'

interface RoutingProps {
  toCommitDetails?: ({ sha }: { sha: string }) => string
  toCode?: ({ sha }: { sha: string }) => string
}
export interface RepoCommitDetailsViewProps extends RoutingProps {
  useCommitDetailsStore: () => ICommitDetailsStore
  showSidebar?: boolean
}

export const RepoCommitDetailsView: FC<RepoCommitDetailsViewProps> = ({
  useCommitDetailsStore,
  showSidebar = true,
  toCommitDetails,
  toCode
}) => {
  const { Outlet, Link } = useRouterContext()
  const { t } = useTranslation()
  const { commitData } = useCommitDetailsStore()

  return (
    <SandboxLayout.Main className="overflow-visible" fullWidth>
      <SandboxLayout.Content className="px-5 pb-0">
        <Text className="mt-7" variant="heading-section">
          {t('views:commits.commitDetailsTitle', 'Commit')}
        </Text>
        <div className="mt-5 rounded-md border border-cn-borders-2">
          <div className="flex items-center justify-between rounded-t-md border-b border-cn-borders-2 bg-cn-background-2 px-4 py-3">
            <span className="text-14 font-mono font-medium leading-snug text-cn-foreground-1">{commitData?.title}</span>
            <Button variant="outline" asChild>
              <Link to={toCode?.({ sha: commitData?.sha || '' }) || ''}>
                {t('views:commits.browseFiles', 'Browse files')}
              </Link>
            </Button>
          </div>
          <div className="flex items-center justify-between px-4 py-3">
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
      {showSidebar && (
        <SandboxLayout.Content className="border-cn-borders-4 mt-5 grid grid-cols-[auto_1fr] border-t py-0 pl-0 pr-5">
          <Outlet />
        </SandboxLayout.Content>
      )}
    </SandboxLayout.Main>
  )
}
