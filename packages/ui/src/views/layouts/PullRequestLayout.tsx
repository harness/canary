import { FC, PropsWithChildren, useCallback } from 'react'
import { NavLink } from 'react-router-dom'

import { Badge, BadgeProps, Icon, IconProps, Tabs, TabsTriggerProps } from '@/components'
import { useRouterContext } from '@/context'
import { cn } from '@/utils'
import { SandboxLayout } from '@views/layouts/SandboxLayout'
import { TranslationStore } from '@views/repo'
import { PullRequestHeader } from '@views/repo/pull-request/components/pull-request-header'
import { IPullRequestStore } from '@views/repo/pull-request/pull-request.types'

const TabTitleWithIcon = ({ icon, children }: PropsWithChildren<{ icon: IconProps['name'] }>) => (
  <div className="flex items-center gap-x-1">
    <Icon className="text-icons-1 group-data-[state=active]:text-icons-2" size={14} name={icon} />
    {children}
  </div>
)

const badgeCommonProps: BadgeProps = {
  variant: 'counter',
  size: 'sm'
}

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

  const getTabProps = useCallback(
    (tab: PullRequestTabsKeys): TabsTriggerProps => ({
      value: tab,
      className: 'group gap-x-1.5',
      role: 'link'
    }),
    []
  )

  return (
    <SandboxLayout.Main fullWidth>
      <SandboxLayout.Content className="mx-auto max-w-[1500px] px-6">
        {pullRequest && (
          <PullRequestHeader className="mb-10" updateTitle={updateTitle} data={{ ...pullRequest, spaceId, repoId }} />
        )}

        <Tabs.Root variant="tabnav" className="mb-7" defaultValue={PullRequestTabsKeys.CONVERSATION}>
          <Tabs.List className="before:bg-background-9 before:left-1/2 before:w-[calc(100vw-var(--cn-sidebar-width)-var(--cn-inset-layout-indent)*2)] before:min-w-[calc(100%+3rem)] before:-translate-x-1/2">
            <Tabs.Trigger {...getTabProps(PullRequestTabsKeys.CONVERSATION)} asChild>
              <NavLink to={PullRequestTabsKeys.CONVERSATION}>
                <TabTitleWithIcon icon="comments">
                  {t('views:pullRequests.conversation', 'Conversation')}
                </TabTitleWithIcon>
                {pullRequest?.stats?.conversations && (
                  <Badge {...badgeCommonProps}>{pullRequest.stats.conversations}</Badge>
                )}
              </NavLink>
            </Tabs.Trigger>
            <Tabs.Trigger {...getTabProps(PullRequestTabsKeys.COMMITS)} asChild>
              <NavLink to={PullRequestTabsKeys.COMMITS}>
                <TabTitleWithIcon icon="tube-sign">{t('views:pullRequests.commits', 'Commits')}</TabTitleWithIcon>
                <Badge {...badgeCommonProps}>{pullRequest?.stats?.commits}</Badge>
              </NavLink>
            </Tabs.Trigger>
            <Tabs.Trigger {...getTabProps(PullRequestTabsKeys.CHANGES)} asChild>
              <NavLink to={PullRequestTabsKeys.CHANGES}>
                <TabTitleWithIcon icon="changes">{t('views:pullRequests.changes', 'Changes')}</TabTitleWithIcon>
                <Badge {...badgeCommonProps}>{pullRequest?.stats?.files_changed}</Badge>
              </NavLink>
            </Tabs.Trigger>
          </Tabs.List>
        </Tabs.Root>

        <Outlet />
      </SandboxLayout.Content>
    </SandboxLayout.Main>
  )
}
