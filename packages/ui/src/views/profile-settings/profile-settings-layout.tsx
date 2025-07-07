import { TFunctionWithFallback, useRouterContext, useTranslation } from '@/context'
import { ContentLayoutWithSidebar } from '@/views'

const getNavItems = (t: TFunctionWithFallback) => [
  {
    groupId: 0,
    title: t('views:profileSettings.accountSettings', 'Account settings'),
    items: [
      { id: 0, title: t('views:repos.generalTab', 'General'), to: 'general' },
      { id: 1, title: t('views:repos.keysTab', 'Keys and tokens'), to: 'keys' }
    ]
  }
]

export function ProfileSettingsLayout() {
  const { Outlet } = useRouterContext()
  const { t } = useTranslation()

  return (
    <ContentLayoutWithSidebar sidebarMenu={getNavItems(t)} sidebarOffsetTop={55} sidebarViewportClassName="pt-7">
      <Outlet />
    </ContentLayoutWithSidebar>
  )
}
