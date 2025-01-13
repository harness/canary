import { FC } from 'react'
import { Outlet } from 'react-router-dom'

import { Avatar, AvatarFallback, Badge, Button, CommitCopyActions, Icon } from '@/components'
import { SandboxLayout, TranslationStore, TypesCommit } from '@/views'
import { getInitials } from '@utils/stringUtils'
import { timeAgo } from '@utils/utils'

interface CommitDetails extends TypesCommit {
  isVerified?: boolean
}

export interface RepoCommitDetailsViewProps {
  commit: CommitDetails
  useTranslationStore: () => TranslationStore
}

export const RepoCommitDetailsView: FC<RepoCommitDetailsViewProps> = ({ commit, useTranslationStore }) => {
  const { t } = useTranslationStore()

  console.log(commit)

  return (
    <SandboxLayout.Main className="overflow-visible" fullWidth>
      <SandboxLayout.Content className="px-5 pb-0 pt-7">
        <span className="text-24 text-foreground-1 mt-7 font-medium leading-snug tracking-tight">
          Commit <span className="text-foreground-4 ml-1.5 font-normal">{commit?.sha?.substring(0, 7)}</span>
        </span>
        <div className="mt-4 flex items-center">
          {commit?.author?.identity?.name && commit?.author?.when && (
            <>
              <Avatar className="size-6">
                <AvatarFallback className="text-10">{getInitials(commit.author.identity.name)}</AvatarFallback>
              </Avatar>
              <span className="text-14 text-foreground-8 ml-2 font-medium leading-none">
                {commit.author.identity.name}
              </span>
              <span className="text-14 text-foreground-4 ml-1.5 font-normal leading-none">
                authored {timeAgo(new Date(commit.author.when).getTime())}
              </span>
              {commit.isVerified && (
                <>
                  <span className="bg-borders-2 mx-2.5 h-4 w-px" />
                  <Badge size="md" theme="success" borderRadius="full">
                    Verified
                  </Badge>
                </>
              )}
            </>
          )}
        </div>
        <div className="border-borders-1 mt-5 rounded-md border">
          <div className="bg-background-2 border-borders-1 flex items-center justify-between rounded-t-md border-b px-4 py-3">
            <span className="text-14 text-foreground-8 font-mono font-medium leading-snug">{commit?.title}</span>
            <Button variant="outline">Browse files</Button>
          </div>
          <div className="flex items-center justify-between px-4 py-3">
            <div className="bg-background-8 flex h-6 items-center gap-x-1 rounded-md px-2.5">
              <Icon name="branch" size={14} className="text-icons-9" />
              <span className="text-14 text-foreground-8 font-medium leading-snug">main</span>
            </div>
            <CommitCopyActions sha={commit?.sha || ''} />
          </div>
        </div>
      </SandboxLayout.Content>
      <SandboxLayout.Content className="border-borders-4 mt-5 grid grid-cols-[auto_1fr] border-t py-0 pl-0 pr-5">
        <Outlet />
      </SandboxLayout.Content>
    </SandboxLayout.Main>
  )
}
