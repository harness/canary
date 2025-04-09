import { FC, PropsWithChildren, ReactNode } from 'react'
import { NavLinkProps } from 'react-router-dom'

import { Badge, Icon, IconProps, Tabs } from '@/components'
import { useRouterContext, useTheme } from '@/context'
import { cn } from '@/utils'
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
  const { isInset } = useTheme()

  return (
    <SandboxLayout.Main fullWidth>
      <SandboxLayout.Content className="mx-auto max-w-[1500px] px-6">
        {pullRequest && (
          <PullRequestHeader className="mb-10" updateTitle={updateTitle} data={{ ...pullRequest, spaceId, repoId }} />
        )}

        <Tabs.Root variant="tabnav" className="mb-7">
          <Tabs.List
            className={cn(
              'before:w-[calc(100vw-var(--sidebar-width))] before:min-w-[calc(100%+3rem)] before:left-1/2 before:-translate-x-1/2',
              { 'before:w-[calc(100vw-var(--sidebar-width)-6px*2)]': isInset }
            )}
          >
            <Tabs.Trigger className="gap-x-1.5" to={PullRequestTabsKeys.CONVERSATION} asLink>
              <TabTitleWithIcon
                icon="comments"
                badgeContent={!!pullRequest?.stats?.conversations && pullRequest?.stats?.conversations}
              >
                {t('views:pullRequests.conversation', 'Conversation')}
              </TabTitleWithIcon>
            </Tabs.Trigger>
            <Tabs.Trigger className="gap-x-1.5" to={PullRequestTabsKeys.COMMITS} asLink>
              <TabTitleWithIcon icon="tube-sign" badgeContent={pullRequest?.stats?.commits}>
                {t('views:pullRequests.commits', 'Commits')}
              </TabTitleWithIcon>
            </Tabs.Trigger>
            <Tabs.Trigger className="gap-x-1.5" to={PullRequestTabsKeys.CHANGES} asLink>
              <TabTitleWithIcon icon="changes" badgeContent={pullRequest?.stats?.files_changed}>
                {t('views:pullRequests.changes', 'Changes')}
              </TabTitleWithIcon>
            </Tabs.Trigger>
          </Tabs.List>
        </Tabs.Root>

        <Outlet />
      </SandboxLayout.Content>
    </SandboxLayout.Main>
  )
}
