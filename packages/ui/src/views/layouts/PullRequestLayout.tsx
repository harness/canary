import { FC, PropsWithChildren, ReactNode } from 'react'

import { Badge, Icon, IconProps, TabNav } from '@/components'
import { useRouterContext } from '@/context'
import { SandboxLayout } from '@views/layouts/SandboxLayout'
import { TranslationStore } from '@views/repo'
import { PullRequestHeader } from '@views/repo/pull-request/components/pull-request-header'
import { IPullRequestStore } from '@views/repo/pull-request/pull-request.types'

const TabTitleWithIcon = ({
  icon,
  children,
  badgeContent
}: PropsWithChildren<{ icon: IconProps['name']; badgeContent?: ReactNode }>) => (
  <>
    <div className="flex items-center gap-x-1">
      <Icon className="text-icons-1 group-[.is-active]:text-icons-2" size={14} name={icon} />
      {children}
    </div>
    {!!badgeContent && (
      <Badge className="text-foreground-2 font-normal" variant="counter" size="sm">
        {badgeContent}
      </Badge>
    )}
  </>
)

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

export const PullRequestLayout: FC<PullRequestLayoutProps> = ({
  usePullRequestStore,
  useTranslationStore,
  spaceId,
  repoId,
  updateTitle
}) => {
  const { Outlet } = useRouterContext()
  const { pullRequest } = usePullRequestStore()
  const { t } = useTranslationStore()

  return (
    <SandboxLayout.Main fullWidth>
      <SandboxLayout.Content className="mx-auto max-w-[1500px] px-6">
        {pullRequest && (
          <PullRequestHeader className="mb-10" updateTitle={updateTitle} data={{ ...pullRequest, spaceId, repoId }} />
        )}

        <TabNav.Root variant="tabs" className="mb-7 before:-left-6 before:w-[calc(100%+3rem)]">
          <TabNav.Item to={PullRequestTabsKeys.CONVERSATION}>
            <TabTitleWithIcon
              icon="comments"
              badgeContent={!!pullRequest?.stats?.conversations && pullRequest?.stats?.conversations}
            >
              {t('views:pullRequests.conversation', 'Conversation')}
            </TabTitleWithIcon>
          </TabNav.Item>

          <TabNav.Item to={PullRequestTabsKeys.COMMITS}>
            <TabTitleWithIcon icon="tube-sign" badgeContent={pullRequest?.stats?.commits}>
              {t('views:pullRequests.commits', 'Commits')}
            </TabTitleWithIcon>
          </TabNav.Item>

          <TabNav.Item to={PullRequestTabsKeys.CHANGES}>
            <TabTitleWithIcon icon="changes" badgeContent={pullRequest?.stats?.files_changed}>
              {t('views:pullRequests.changes', 'Changes')}
            </TabTitleWithIcon>
          </TabNav.Item>
        </TabNav.Root>

        <Outlet />
      </SandboxLayout.Content>
    </SandboxLayout.Main>
  )
}
