import { FC } from 'react'

import { Avatar, AvatarFallback, Badge, Button, CommitCopyActions, Icon } from '@/components'
import { DiffFileEntry, SandboxLayout, TranslationStore, TypesCommit, TypesDiffStats } from '@/views'
import { getInitials } from '@utils/stringUtils'
import { timeAgo } from '@utils/utils'

import { HeaderProps } from '../pull-request/compare/pull-request-compare.types'
import { CommitChanges } from './components/commit-changes'

interface CommitDetails extends TypesCommit {
  isVerified?: boolean
  diffs: DiffFileEntry[]
  diffStats?: TypesDiffStats
}

export interface RepoCommitDetailsViewProps {
  commit: CommitDetails
  useTranslationStore: () => TranslationStore
}

export const RepoCommitDetailsView: FC<RepoCommitDetailsViewProps> = ({ commit, useTranslationStore }) => {
  const { t } = useTranslationStore()

  console.log(commit.diffStats)

  return (
    <SandboxLayout.Main fullWidth>
      <SandboxLayout.Content className="px-5 pt-7">
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
        <p className="text-14 leading-tight text-foreground-4 py-2">
          Showing <span className="text-foreground-accent">{commit?.diffStats?.files_changed || 0} changed files </span>
          with {commit?.diffStats?.additions || 0} additions and {commit?.diffStats?.deletions || 0} deletions
        </p>
        <CommitChanges
          data={
            commit.diffs?.map(item => ({
              text: item.filePath,
              numAdditions: item.addedLines,
              numDeletions: item.deletedLines,
              data: item.raw,
              title: item.filePath,
              lang: item.filePath.split('.')[1],
              fileViews: item.fileViews,
              checksumAfter: item.checksumAfter,
              filePath: item.filePath
            })) || []
          }
          useTranslationStore={useTranslationStore}
          diffMode={2}
        />
      </SandboxLayout.Content>
    </SandboxLayout.Main>
  )
}
