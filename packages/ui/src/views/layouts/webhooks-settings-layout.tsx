import { TFunctionWithFallback, useRouterContext, useTranslation } from '@/context'
import { ContentLayoutWithSidebar } from '@/views'

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
      sidebarViewportClassName="pt-5"
      showBackButton
      backButtonLabel="Back to webhooks"
      backButtonTo={() => '../settings/webhooks'}
    >
      <Outlet />
    </ContentLayoutWithSidebar>
  )
}
