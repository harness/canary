import { FC } from 'react'

import { Avatar, Button, CommitCopyActions, StatusBadge, Tag } from '@/components'
import { useRouterContext, useTranslation } from '@/context'
import { timeAgo } from '@/utils'
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
  const { commitData, isVerified } = useCommitDetailsStore()

  return (
    <SandboxLayout.Main className="overflow-visible" fullWidth>
      <SandboxLayout.Content className="px-5 pb-0 pt-7">
        <span className="mt-7 text-6 font-medium leading-snug tracking-tight text-cn-foreground-1">
          {t('views:commits.commitDetailsTitle', 'Commit')}
          <span className="ml-1.5 font-normal text-cn-foreground-2">{commitData?.sha?.substring(0, 7)}</span>
        </span>
        <div className="mt-4 flex items-center">
          {commitData?.author?.identity?.name && commitData?.author?.when && (
            <>
              <Avatar name={commitData.author.identity.name} rounded />
              <span className="ml-2 text-2 font-medium leading-none text-cn-foreground-1">
                {commitData.author.identity.name}
              </span>
              <span className="ml-1.5 text-2 font-normal leading-none text-cn-foreground-2">
                {t('views:commits.commitDetailsAuthored', 'authored')}{' '}
                {timeAgo(new Date(commitData.author.when).getTime())}
              </span>
              {isVerified && (
                <>
                  <span className="mx-2.5 h-4 w-px bg-cn-background-3" />
                  <StatusBadge variant="outline" theme="success">
                    {t('views:commits.verified', 'Verified')}
                  </StatusBadge>
                </>
              )}
            </>
          )}
        </div>
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
            {/* TODO: get branch name from commitData */}
            <Tag value="main" icon="branch-2" variant="secondary" showIcon />
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
