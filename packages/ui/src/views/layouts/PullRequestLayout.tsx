import { FC } from 'react'

import { Badge, Icon, Spacer, Tabs } from '@/components'
import { useRouterContext } from '@/context'
import { SandboxLayout } from '@/views'
import { TranslationStore } from '@views/repo'
import { PullRequestHeader } from '@views/repo/pull-request/components/pull-request-header'
import { IPullRequestStore } from '@views/repo/pull-request/pull-request.types'

interface PullRequestLayoutProps {
  usePullRequestStore: () => IPullRequestStore
  spaceId?: string
  repoId?: string
  useTranslationStore: () => TranslationStore
  updateTitle: (title: string, description: string) => Promise<void>
}

enum PullRequestTabsKeys {
  CONVERSATION = 'conversation',
  COMMITS = 'commits',
  CHANGES = 'changes'
}

const PullRequestLayout: FC<PullRequestLayoutProps> = ({
  usePullRequestStore,
  useTranslationStore,
  spaceId,
  repoId,
  updateTitle
}) => {
  const { NavLink, Outlet } = useRouterContext()
  const { pullRequest } = usePullRequestStore()
  const { t } = useTranslationStore()

  return (
    <SandboxLayout.Main fullWidth>
      <SandboxLayout.Content className="mx-auto max-w-[1500px] px-6">
        {pullRequest && (
          <>
            <PullRequestHeader
              updateTitle={updateTitle}
              data={{
                title: pullRequest?.title,
                number: pullRequest?.number,
                merged: pullRequest?.merged,
                author: pullRequest?.author,
                stats: { commits: pullRequest?.stats?.commits },
                target_branch: pullRequest?.target_branch,
                source_branch: pullRequest?.source_branch,
                created: pullRequest?.created,
                is_draft: pullRequest?.is_draft,
                state: pullRequest?.state,
                description: pullRequest?.description,
                spaceId,
                repoId
              }}
            />
            <Spacer size={10} />
          </>
        )}
        <Tabs.Root variant="tabnav">
          <Tabs.List className="before:left-1/2 before:w-[calc(100vw-220px)] before:-translate-x-1/2">
            <NavLink to={PullRequestTabsKeys.CONVERSATION}>
              {({ isActive }) => (
                <Tabs.Trigger
                  className="group gap-x-1.5"
                  value={PullRequestTabsKeys.CONVERSATION}
                  data-state={isActive ? 'active' : 'inactive'}
                >
                  <div className="flex items-center gap-x-1">
                    <Icon className="text-icons-1 group-data-[state=active]:text-icons-2" size={14} name="comments" />
                    {t('views:pullRequests.conversation')}
                  </div>
                  {pullRequest?.stats?.conversations && (
                    <Badge className="font-normal text-foreground-2" variant="quaternary" size="xs" borderRadius="base">
                      {pullRequest.stats.conversations}
                    </Badge>
                  )}
                </Tabs.Trigger>
              )}
            </NavLink>
            <NavLink to={PullRequestTabsKeys.COMMITS}>
              {({ isActive }) => (
                <Tabs.Trigger
                  className="group gap-x-1.5"
                  value={PullRequestTabsKeys.COMMITS}
                  data-state={isActive ? 'active' : 'inactive'}
                >
                  <div className="flex items-center gap-x-1">
                    <Icon className="text-icons-1 group-data-[state=active]:text-icons-2" size={14} name="tube-sign" />
                    {t('views:repos.commits')}
                  </div>
                  <Badge className="font-normal text-foreground-2" variant="quaternary" size="xs" borderRadius="base">
                    {pullRequest?.stats?.commits}
                  </Badge>
                </Tabs.Trigger>
              )}
            </NavLink>
            <NavLink to={PullRequestTabsKeys.CHANGES}>
              {({ isActive }) => (
                <Tabs.Trigger
                  className="group gap-x-1.5"
                  value={PullRequestTabsKeys.CHANGES}
                  data-state={isActive ? 'active' : 'inactive'}
                >
                  <div className="flex items-center gap-x-1">
                    <Icon className="text-icons-1 group-data-[state=active]:text-icons-2" size={14} name="changes" />
                    {t('views:pullRequests.changes')}
                  </div>
                  <Badge className="font-normal text-foreground-2" variant="quaternary" size="xs" borderRadius="base">
                    {pullRequest?.stats?.files_changed}
                  </Badge>
                </Tabs.Trigger>
              )}
            </NavLink>
          </Tabs.List>
        </Tabs.Root>
        <Spacer size={7} />
        <Outlet />
      </SandboxLayout.Content>
    </SandboxLayout.Main>
  )
}

export { PullRequestLayout }
