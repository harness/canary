import { Outlet } from 'react-router-dom'

import { ContentLayoutWithSidebar, TranslationStore } from '@/views'
import { TFunction } from 'i18next'

const getNavItems = (t: TFunction) => [
  {
    groupId: 0,
    title: t('views:repos.general', 'General'),
    items: [{ id: 0, title: t('views:repos.generalSettings', 'General Settings'), to: 'general' }]
  },
  // {
  //   groupId: 1,
  //   title: 'Access',
  //   items: [
  //     { id: 0, title: 'Collaborations', to: 'collaborations' },
  //     { id: 1, title: 'Moderation options', to: 'moderation' }
  //   ]
  // },
  {
    groupId: 2,
    title: t('views:repos.codeAutomation', 'Code and automation'),
    items: [
      // { id: 0, text: 'Branches', to: 'branches' },
      // { id: 1, text: 'Tags', to: 'tags' },
      { id: 0, title: t('views:repos.rules', 'Rules'), to: 'rules' },
      // { id: 3, text: 'Actions', to: 'actions' },
      { id: 1, title: t('views:repos.webhooks', 'Webhooks'), to: 'webhooks' },
      { id: 2, title: t('views:repos.labels', 'Labels'), to: 'labels' }
      // { id: 5, text: 'Environments', to: 'environments' },
      // { id: 6, text: 'Codespaces', to: 'codespaces' },
      // { id: 7, text: 'Pages', to: 'pages' }
    ]
  }
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

export function RepoSettingsLayout({ useTranslationStore }: { useTranslationStore: () => TranslationStore }) {
  const { t } = useTranslationStore()

  return (
    <ContentLayoutWithSidebar sidebarMenu={getNavItems(t)} sidebarOffsetTop={100} sidebarViewportClassName="pt-7">
      <Outlet />
    </ContentLayoutWithSidebar>
  )
}
