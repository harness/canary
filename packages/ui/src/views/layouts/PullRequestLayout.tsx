import { NavLink, Outlet } from 'react-router-dom'

import { Badge, Icon, Spacer, Tabs, TabsList, TabsTrigger } from '@components/index'
import { TranslationStore } from '@views/repo'
import { PullRequestHeader } from '@views/repo/pull-request/components/pull-request-header'
import { IPullRequestStore } from '@views/repo/pull-request/pull-request.types'

import { SandboxLayout } from '..'

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

const PullRequestLayout: React.FC<PullRequestLayoutProps> = ({
  usePullRequestStore,
  useTranslationStore,
  spaceId,
  repoId,
  updateTitle
}) => {
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
        <Tabs variant="tabnav">
          <TabsList className="before:left-1/2 before:w-screen before:-translate-x-1/2">
            <NavLink to={PullRequestTabsKeys.CONVERSATION}>
              {({ isActive }) => (
                <TabsTrigger
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
                </TabsTrigger>
              )}
            </NavLink>
            <NavLink to={PullRequestTabsKeys.COMMITS}>
              {({ isActive }) => (
                <TabsTrigger
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
                </TabsTrigger>
              )}
            </NavLink>
            <NavLink to={PullRequestTabsKeys.CHANGES}>
              {({ isActive }) => (
                <TabsTrigger
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
                </TabsTrigger>
              )}
            </NavLink>
          </TabsList>
        </Tabs>
        <Spacer size={7} />
        <Outlet />
      </SandboxLayout.Content>
    </SandboxLayout.Main>
  )
}

export { PullRequestLayout }
