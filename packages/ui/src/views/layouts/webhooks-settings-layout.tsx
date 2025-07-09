import { TFunctionWithFallback, useRouterContext, useTranslation } from '@/context'
import { ContentLayoutWithSidebar } from '@/views'

const getNavItems = (t: TFunctionWithFallback) => [
  {
    groupId: 0,
    title: t('views:repos.general', 'Webhook Settings'),
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
    <ContentLayoutWithSidebar sidebarMenu={getNavItems(t)} sidebarOffsetTop={100} sidebarViewportClassName="pt-7">
      <Outlet />
    </ContentLayoutWithSidebar>
  )
}
