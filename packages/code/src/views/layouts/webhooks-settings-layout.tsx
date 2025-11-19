import { ContentLayoutWithSidebar } from '@/views'

import { TFunctionWithFallback, useRouterContext, useTranslation } from '@harnessio/ui/context'

const getNavItems = (t: TFunctionWithFallback) => [
  {
    groupId: 0,
    // title: t('views:repos.webhookSettings', 'Webhook Settings'),
    items: [
      { id: 0, title: t('views:repos.details', 'Details'), to: 'details' },
      { id: 1, title: t('views:repos.executions', 'Executions'), to: 'executions' }
    ]
  }
]

export function WebhookSettingsLayout() {
  const { Outlet } = useRouterContext()
  const { t } = useTranslation()

  return (
    <ContentLayoutWithSidebar
      sidebarMenu={getNavItems(t)}
      showBackButton
      backButtonLabel="Back to webhooks"
      backButtonTo={() => '../settings/webhooks'}
    >
      <Outlet />
    </ContentLayoutWithSidebar>
  )
}
