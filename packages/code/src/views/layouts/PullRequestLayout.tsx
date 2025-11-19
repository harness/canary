import { FC } from 'react'

import { SandboxLayout } from '@views/layouts/SandboxLayout'
import { BranchSelectorContainerProps } from '@views/repo'
import { PullRequestHeader } from '@views/repo/pull-request/components/pull-request-header'
import { IPullRequestStore } from '@views/repo/pull-request/pull-request.types'

import { Tabs } from '@harnessio/ui/components'
import { useRouterContext, useTranslation } from '@harnessio/ui/context'

interface PullRequestLayoutProps {
  usePullRequestStore: () => IPullRequestStore
  spaceId?: string
  repoId?: string
  updateTitleAndDescription: (title: string, description: string) => void
  updateTargetBranch: (branchName: string) => void
  branchSelectorRenderer: React.ComponentType<BranchSelectorContainerProps>
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
  updateTitleAndDescription,
  updateTargetBranch,
  branchSelectorRenderer
}) => {
  const { Outlet } = useRouterContext()
  const { pullRequest } = usePullRequestStore()
  const { t } = useTranslation()

  return (
    <SandboxLayout.Main fullWidth>
      <SandboxLayout.Content>
        {pullRequest && (
          <PullRequestHeader
            className="mb-cn-xl"
            updateTitle={(title: string) => {
              updateTitleAndDescription(title, pullRequest.description ?? '')
            }}
            updateTargetBranch={updateTargetBranch}
            data={{ ...pullRequest, spaceId, repoId }}
            branchSelectorRenderer={branchSelectorRenderer}
          />
        )}

        <Tabs.NavRoot>
          <Tabs.List className="-mx-cn-2xl px-cn-2xl" variant="overlined">
            <Tabs.Trigger
              value={PullRequestTabsKeys.CONVERSATION}
              icon="chat-bubble-empty"
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
              icon="empty-page"
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
