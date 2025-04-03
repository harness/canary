import { FC } from 'react'

import { Avatar, Badge, Button, CommitCopyActions, Icon } from '@/components'
import { useRouterContext } from '@/context'
import { ICommitDetailsStore, SandboxLayout, TranslationStore } from '@/views'
import { getInitials } from '@utils/stringUtils'
import { timeAgo } from '@utils/utils'

interface RoutingProps {
  toCommitDetails?: ({ sha }: { sha: string }) => string
}
export interface RepoCommitDetailsViewProps extends RoutingProps {
  useCommitDetailsStore: () => ICommitDetailsStore
  useTranslationStore: () => TranslationStore
  showSidebar?: boolean
}

export const RepoCommitDetailsView: FC<RepoCommitDetailsViewProps> = ({
  useCommitDetailsStore,
  useTranslationStore,
  showSidebar = true,
  toCommitDetails
}) => {
  const { Outlet } = useRouterContext()
  const { t } = useTranslationStore()
  const { commitData, isVerified } = useCommitDetailsStore()

  return (
    <SandboxLayout.Main className="overflow-visible" fullWidth>
      <SandboxLayout.Content className="px-5 pb-0 pt-7">
        <span className="mt-7 text-24 font-medium leading-snug tracking-tight text-cn-foreground-1">
          {t('views:commits.commitDetailsTitle', 'Commit')}
          <span className="ml-1.5 font-normal text-cn-foreground-2">{commitData?.sha?.substring(0, 7)}</span>
        </span>
        <div className="mt-4 flex items-center">
          {commitData?.author?.identity?.name && commitData?.author?.when && (
            <>
              <Avatar.Root>
                <Avatar.Fallback className="text-10">{getInitials(commitData.author.identity.name)}</Avatar.Fallback>
              </Avatar.Root>
              <span className="ml-2 text-14 font-medium leading-none text-cn-foreground-1">
                {commitData.author.identity.name}
              </span>
              <span className="ml-1.5 text-14 font-normal leading-none text-cn-foreground-2">
                {t('views:commits.commitDetailsAuthored', 'authored')}{' '}
                {timeAgo(new Date(commitData.author.when).getTime())}
              </span>
              {isVerified && (
                <>
                  <span className="mx-2.5 h-4 w-px bg-borders-2" />
                  <Badge variant="surface" theme="success">
                    {t('views:commits.verified', 'Verified')}
                  </Badge>
                </>
              )}
            </>
          )}
        </div>
        <div className="mt-5 rounded-md border border-cn-borders-2">
          <div className="flex items-center justify-between rounded-t-md border-b border-cn-borders-2 bg-cn-background-2 px-4 py-3">
            <span className="font-mono text-14 font-medium leading-snug text-cn-foreground-1">{commitData?.title}</span>
            <Button variant="outline">{t('views:commits.browseFiles', 'Browse files')}</Button>
          </div>
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex h-6 items-center gap-x-1 rounded-md bg-cn-background-8 px-2.5">
              <Icon name="branch" size={14} className="text-icons-9" />
              {/* TODO: get branch name from commitData */}
              <span className="text-14 font-medium leading-snug text-cn-foreground-1">main</span>
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
