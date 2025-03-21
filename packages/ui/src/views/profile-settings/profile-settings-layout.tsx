import { useRouterContext } from '@/context'
import { ContentLayoutWithSidebar, TranslationStore } from '@/views'
import { TFunction } from 'i18next'

const getNavItems = (t: TFunction) => [
  {
    groupId: 0,
    title: t('views:profileSettings.accountSettings', 'Account settings'),
    items: [
      { id: 0, title: t('views:repos.generalTab', 'General'), to: 'general' },
      { id: 1, title: t('views:repos.keysTab', 'Keys and tokens'), to: 'keys' }
    ]
  }
]

export function ProfileSettingsLayout({ useTranslationStore }: { useTranslationStore: () => TranslationStore }) {
  const { Outlet } = useRouterContext()
  const { t } = useTranslationStore()

  return (
    <ContentLayoutWithSidebar sidebarMenu={getNavItems(t)} sidebarOffsetTop={0} sidebarViewportClassName="pt-7">
      <Outlet />
    </ContentLayoutWithSidebar>
  )
}
