import { FC } from 'react'

import { Tabs } from '@/components/tabs'
import { useRouterContext, useTranslation } from '@/context'
import { SandboxLayout } from '@views/layouts/SandboxLayout'
import { PullRequestHeader } from '@views/repo/pull-request/components/pull-request-header'
import { IPullRequestStore } from '@views/repo/pull-request/pull-request.types'

interface PullRequestLayoutProps {
  usePullRequestStore: () => IPullRequestStore
  spaceId?: string
  repoId?: string
  updateTitle: (title: string, description: string) => void
}

enum PullRequestTabsKeys {
  CONVERSATION = 'conversation',
  COMMITS = 'commits',
  CHANGES = 'changes'
}

export const PullRequestLayout: FC<PullRequestLayoutProps> = ({
  usePullRequestStore,
  spaceId,
  repoId,
  updateTitle
}) => {
  const { Outlet } = useRouterContext()
  const { pullRequest } = usePullRequestStore()
  const { t } = useTranslation()

  return (
    <SandboxLayout.Main fullWidth>
      <SandboxLayout.Content className="mx-auto max-w-[1500px] px-6">
        {pullRequest && (
          <PullRequestHeader className="mb-10" updateTitle={updateTitle} data={{ ...pullRequest, spaceId, repoId }} />
        )}

        <Tabs.NavRoot>
          <Tabs.List className="-mx-6 mb-7 px-6" variant="overlined">
            <Tabs.Trigger
              value={PullRequestTabsKeys.CONVERSATION}
              icon="message"
              counter={pullRequest?.stats?.conversations}
            >
              {t('views:pullRequests.conversation', 'Conversation')}
            </Tabs.Trigger>

            <Tabs.Trigger value={PullRequestTabsKeys.COMMITS} icon="git-commit" counter={pullRequest?.stats?.commits}>
              {t('views:pullRequests.commits', 'Commits')}
            </Tabs.Trigger>

            <Tabs.Trigger
              value={PullRequestTabsKeys.CHANGES}
              counter={pullRequest?.stats?.files_changed}
              icon="page-edit"
            >
              {t('views:pullRequests.changes', 'Changes')}
            </Tabs.Trigger>
          </Tabs.List>
        </Tabs.NavRoot>

        <Outlet />
      </SandboxLayout.Content>
    </SandboxLayout.Main>
  )
}
