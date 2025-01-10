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
  repoId
}) => {
  const { pullRequest } = usePullRequestStore()
  const { t } = useTranslationStore()

  return (
    <>
      <SandboxLayout.Main fullWidth>
        <SandboxLayout.Content className="px-6 pt-7" maxWidth="4xl">
          {pullRequest && (
            <>
              <PullRequestHeader
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
                  spaceId,
                  repoId
                }}
              />
              <Spacer size={10} />
            </>
          )}
          <Tabs variant="tabnav">
            <TabsList className="left-1/2 w-[calc(100%+48px)] -translate-x-1/2 px-6">
              <NavLink to={PullRequestTabsKeys.CONVERSATION}>
                {({ isActive }) => (
                  <TabsTrigger
                    className="gap-x-1"
                    value={PullRequestTabsKeys.CONVERSATION}
                    data-state={isActive ? 'active' : 'inactive'}
                  >
                    <Icon size={14} name="comments" />
                    {t('views:pullRequests.conversation')}
                    <Badge variant="outline" size="xs">
                      {pullRequest?.stats?.conversations || 0}
                    </Badge>
                  </TabsTrigger>
                )}
              </NavLink>
              <NavLink to={PullRequestTabsKeys.COMMITS}>
                {({ isActive }) => (
                  <TabsTrigger
                    className="gap-x-1"
                    value={PullRequestTabsKeys.COMMITS}
                    data-state={isActive ? 'active' : 'inactive'}
                  >
                    <Icon size={14} name="tube-sign" />
                    {t('views:repos.commits')}
                    <Badge variant="outline" size="xs">
                      {pullRequest?.stats?.commits}
                    </Badge>
                  </TabsTrigger>
                )}
              </NavLink>
              <NavLink to={PullRequestTabsKeys.CHANGES}>
                {({ isActive }) => (
                  <TabsTrigger
                    className="gap-x-1"
                    value={PullRequestTabsKeys.CHANGES}
                    data-state={isActive ? 'active' : 'inactive'}
                  >
                    <Icon size={14} name="changes" />
                    {t('views:pullRequests.changes')}
                    <Badge variant="outline" size="xs">
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
    </>
  )
}

export { PullRequestLayout }
