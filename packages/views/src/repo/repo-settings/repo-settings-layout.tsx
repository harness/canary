import { ContentLayoutWithSidebar } from '@views'

import { TFunctionWithFallback, useRouterContext, useTranslation } from '@harnessio/ui/context'

export interface RepoSettingsLayoutProps {
  /** Toggles the "AI Code Review" sidebar entry. Driven by host feature flag. */
  aiCodeReviewEnabled?: boolean
}

const getNavItems = (t: TFunctionWithFallback, { aiCodeReviewEnabled }: RepoSettingsLayoutProps = {}) => [
  {
    groupId: 0,
    // title: t('views:repos.general', 'General'),
    items: [
      { id: 0, title: t('views:repos.general', 'General'), to: 'general' },
      { id: 1, title: t('views:repos.labels', 'Labels'), to: 'labels' },
      { id: 2, title: t('views:repos.rules', 'Rules'), to: 'rules' },
      { id: 3, title: t('views:repos.webhooks', 'Webhooks'), to: 'webhooks' },
      ...(aiCodeReviewEnabled
        ? [{ id: 4, title: t('views:repos.aiCodeReview', 'AI Code Review'), to: 'code-review' }]
        : [])
    ]
  }
  // {
  //   groupId: 1,
  //   title: 'Access',
  //   items: [
  //     { id: 0, title: 'Collaborations', to: 'collaborations' },
  //     { id: 1, title: 'Moderation options', to: 'moderation' }
  //   ]
  // },
  // {
  //   groupId: 2,
  //   title: t('views:code', 'Code'),
  //   items: [
  //     // { id: 0, text: 'Branches', to: 'branches' },
  //     // { id: 1, text: 'Tags', to: 'tags' },
  //     { id: 0, title: t('views:repos.rules', 'Rules'), to: 'rules' },
  //     // { id: 3, text: 'Actions', to: 'actions' },
  //     { id: 1, title: t('views:repos.webhooks', 'Webhooks'), to: 'webhooks' },
  //     { id: 2, title: t('views:repos.labels', 'Labels'), to: 'labels' }
  //     // { id: 5, text: 'Environments', to: 'environments' },
  //     // { id: 6, text: 'Codespaces', to: 'codespaces' },
  //     // { id: 7, text: 'Pages', to: 'pages' }
  //   ]
  // }
  // {
  //   groupId: 3,
  //   groupTitle: 'Security',
  //   items: [
  //     { id: 0, text: 'Code security and analysis', to: 'code-security' },
  //     { id: 1, text: 'Deploy keys', to: 'deploy-keys' },
  //     { id: 2, text: 'Secrets and variables', to: 'secrets-variables' }
  //   ]
  // },
  // {
  //   id: 4,
  //   groupTitle: 'Notifications',
  //   items: [{ id: 0, text: 'Email notifications', to: 'email-notifications' }]
  // }
]

export function RepoSettingsLayout({ aiCodeReviewEnabled }: RepoSettingsLayoutProps = {}) {
  const { Outlet } = useRouterContext()
  const { t } = useTranslation()

  return (
    <ContentLayoutWithSidebar sidebarMenu={getNavItems(t, { aiCodeReviewEnabled })}>
      <Outlet />
    </ContentLayoutWithSidebar>
  )
}
