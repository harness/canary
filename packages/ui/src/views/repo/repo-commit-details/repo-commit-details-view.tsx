import { FC } from 'react'
import { Outlet } from 'react-router-dom'

import { Avatar, AvatarFallback, Badge, Button, CommitCopyActions, Icon } from '@/components'
import { ICommitDetailsStore, SandboxLayout, TranslationStore } from '@/views'
import { getInitials } from '@utils/stringUtils'
import { timeAgo } from '@utils/utils'

export interface RepoCommitDetailsViewProps {
  useCommitDetailsStore: () => ICommitDetailsStore
  useTranslationStore: () => TranslationStore
}

export const RepoCommitDetailsView: FC<RepoCommitDetailsViewProps> = ({
  useCommitDetailsStore,
  useTranslationStore
}) => {
  const { t } = useTranslationStore()
  const { commitData, isVerified } = useCommitDetailsStore()

  return (
    <SandboxLayout.Main className="overflow-visible" fullWidth>
      <SandboxLayout.Content className="px-5 pb-0 pt-7">
        <span className="text-24 text-foreground-1 mt-7 font-medium leading-snug tracking-tight">
          {t('views:commits.commitDetailsTitle', 'Commit')}
          <span className="text-foreground-4 ml-1.5 font-normal">{commitData?.sha?.substring(0, 7)}</span>
        </span>
        <div className="mt-4 flex items-center">
          {commitData?.author?.identity?.name && commitData?.author?.when && (
            <>
              <Avatar className="size-6">
                <AvatarFallback className="text-10">{getInitials(commitData.author.identity.name)}</AvatarFallback>
              </Avatar>
              <span className="text-14 text-foreground-8 ml-2 font-medium leading-none">
                {commitData.author.identity.name}
              </span>
              <span className="text-14 text-foreground-4 ml-1.5 font-normal leading-none">
                {t('views:commits.commitDetailsAuthored', 'authored')}{' '}
                {timeAgo(new Date(commitData.author.when).getTime())}
              </span>
              {isVerified && (
                <>
                  <span className="bg-borders-2 mx-2.5 h-4 w-px" />
                  <Badge size="md" theme="success" borderRadius="full">
                    {t('views:commits.verified', 'Verified')}
                  </Badge>
                </>
              )}
            </>
          )}
        </div>
        <div className="border-borders-1 mt-5 rounded-md border">
          <div className="border-borders-1 bg-background-2 flex items-center justify-between rounded-t-md border-b px-4 py-3">
            <span className="text-14 text-foreground-8 font-mono font-medium leading-snug">{commitData?.title}</span>
            <Button variant="outline">{t('views:commits.browseFiles', 'Browse files')}</Button>
          </div>
          <div className="flex items-center justify-between px-4 py-3">
            <div className="bg-background-8 flex h-6 items-center gap-x-1 rounded-md px-2.5">
              <Icon name="branch" size={14} className="text-icons-9" />
              {/* TODO: get branch name from commitData */}
              <span className="text-14 text-foreground-8 font-medium leading-snug">main</span>
            </div>
            <CommitCopyActions sha={commitData?.sha || ''} />
          </div>
        </div>
      </SandboxLayout.Content>
      <SandboxLayout.Content className="border-borders-4 mt-5 grid grid-cols-[auto_1fr] border-t py-0 pl-0 pr-5">
        <Outlet />
      </SandboxLayout.Content>
    </SandboxLayout.Main>
  )
}
