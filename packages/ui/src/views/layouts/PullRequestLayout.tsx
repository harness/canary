import { FC, PropsWithChildren, ReactNode } from 'react'
import { NavLinkProps } from 'react-router-dom'

import { Badge, Icon, IconProps } from '@/components'
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
      <Badge className="text-foreground-2 font-normal" variant="quaternary" size="xs" borderRadius="base">
        {badgeContent}
      </Badge>
    )}
  </>
)

const PullRequestTabItem: FC<NavLinkProps> = ({ className, ...props }) => {
  const { NavLink } = useRouterContext()

  return (
    <NavLink
      className={({ isActive }) =>
        cn(
          'group relative z-[1] text-foreground-2 hover:text-foreground-1 inline-flex h-9 items-center justify-center gap-x-1.5 whitespace-nowrap rounded-t-md border-x border-t border-transparent px-3.5 py-1 font-normal transition-all focus-visible:duration-0',
          { 'border-borders-1 bg-background-1 text-foreground-1 is-active': isActive },
          className
        )
      }
      {...props}
    />
  )
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

  return (
    <SandboxLayout.Main fullWidth>
      <SandboxLayout.Content className="mx-auto max-w-[1500px] px-6">
        {pullRequest && (
          <PullRequestHeader className="mb-10" updateTitle={updateTitle} data={{ ...pullRequest, spaceId, repoId }} />
        )}

        <nav
          className={cn(
            'relative before:bottom-0 before:absolute before:w-[calc(100vw-var(--sidebar-width))] before:min-w-[calc(100%+3rem)] before:left-1/2 before:-translate-x-1/2 before:border-b before:border-borders-4',
            { 'before:w-[calc(100vw-var(--sidebar-width)-6px)]': isInset }
          )}
        >
          <ul className="mb-7 flex items-center">
            <li>
              <PullRequestTabItem to={PullRequestTabsKeys.CONVERSATION}>
                <TabTitleWithIcon
                  icon="comments"
                  badgeContent={!!pullRequest?.stats?.conversations && pullRequest?.stats?.conversations}
                >
                  {t('views:pullRequests.conversation', 'Conversation')}
                </TabTitleWithIcon>
              </PullRequestTabItem>
            </li>
            <li>
              <PullRequestTabItem to={PullRequestTabsKeys.COMMITS}>
                <TabTitleWithIcon icon="tube-sign" badgeContent={pullRequest?.stats?.commits}>
                  {t('views:pullRequests.commits', 'Commits')}
                </TabTitleWithIcon>
              </PullRequestTabItem>
            </li>
            <li>
              <PullRequestTabItem to={PullRequestTabsKeys.CHANGES}>
                <TabTitleWithIcon icon="changes" badgeContent={pullRequest?.stats?.files_changed}>
                  {t('views:pullRequests.changes', 'Changes')}
                </TabTitleWithIcon>
              </PullRequestTabItem>
            </li>
          </ul>
        </nav>

        {/* <Tabs.Root variant="tabnav" className="mb-7" defaultValue={activeTab}>
          <Tabs.List className="before:bg-background-9 before:left-1/2 before:w-[calc(100vw-var(--cn-sidebar-width)-var(--cn-inset-layout-indent)*2)] before:min-w-[calc(100%+3rem)] before:-translate-x-1/2">
            <Tabs.Trigger className="gap-x-1.5" value={PullRequestTabsKeys.CONVERSATION} asChild>
              <NavLink to={PullRequestTabsKeys.CONVERSATION}>
                <TabTitleWithIcon
                  icon="comments"
                  badgeContent={!!pullRequest?.stats?.conversations && pullRequest?.stats?.conversations}
                >
                  {t('views:pullRequests.conversation', 'Conversation')}
                </TabTitleWithIcon>
              </NavLink>
            </Tabs.Trigger>
            <Tabs.Trigger className="gap-x-1.5" value={PullRequestTabsKeys.COMMITS} asChild>
              <NavLink to={PullRequestTabsKeys.COMMITS}>
                <TabTitleWithIcon icon="tube-sign" badgeContent={pullRequest?.stats?.commits}>
                  {t('views:pullRequests.commits', 'Commits')}
                </TabTitleWithIcon>
              </NavLink>
            </Tabs.Trigger>
            <Tabs.Trigger className="gap-x-1.5" value={PullRequestTabsKeys.CHANGES} asChild>
              <NavLink to={PullRequestTabsKeys.CHANGES}>
                <TabTitleWithIcon icon="changes" badgeContent={pullRequest?.stats?.files_changed}>
                  {t('views:pullRequests.changes', 'Changes')}
                </TabTitleWithIcon>
              </NavLink>
            </Tabs.Trigger>
          </Tabs.List>
        </Tabs.Root> */}

        <Outlet />
      </SandboxLayout.Content>
    </SandboxLayout.Main>
  )
}
