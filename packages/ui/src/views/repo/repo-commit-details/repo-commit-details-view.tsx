import { FC } from 'react'
import { Outlet } from 'react-router-dom'

import { Avatar, AvatarFallback, Badge, Button, CommitCopyActions, Icon, Text } from '@/components'
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
  const { t: _t } = useTranslationStore()
  const { commitData, isVerified } = useCommitDetailsStore()

  return (
    <SandboxLayout.Main fullWidth>
      <SandboxLayout.Content className="px-5 pt-7">
        <Text size={5} weight={'medium'}>
          Commit <span className="text-foreground-4 ml-1.5 font-normal">{commitData?.sha?.substring(0, 7)}</span>
        </Text>
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
                authored {timeAgo(new Date(commitData.author.when).getTime())}
              </span>
              {isVerified && (
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
            <span className="text-14 text-foreground-8 font-mono font-medium leading-snug">{commitData?.title}</span>
            <Button variant="outline">Browse files</Button>
          </div>
          <div className="flex items-center justify-between px-4 py-3">
            <div className="bg-background-8 flex h-6 items-center gap-x-1 rounded-md px-2.5">
              <Icon name="branch" size={14} className="text-icons-9" />
              <span className="text-14 text-foreground-8 font-medium leading-snug">main</span>
            </div>
            <CommitCopyActions sha={commitData?.sha || ''} />
          </div>
        </div>

        <Outlet />
      </SandboxLayout.Content>
    </SandboxLayout.Main>
  )
}
