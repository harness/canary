import { Outlet } from 'react-router-dom'

import { SandboxLayout, TranslationStore } from '@/views'
import { MenuGroupTypes } from '@components/navbar/types'
import { TFunction } from 'i18next'

import { RepoSidebar } from './components/repo-sidebar'

export const getNavItems = (t: TFunction) => [
  {
    groupId: 0,
    title: t('views:repos.general', 'General'),
    type: MenuGroupTypes.GENERAL,

    items: [{ id: 0, title: t('views:repos.generalSettings', 'General Settings'), to: 'general' }]
  },
  // {
  //   groupId: 1,
  //   title: 'Access',
  //   type: MenuGroupTypes.GENERAL,

  //   items: [
  //     { id: 0, title: 'Collaborations', to: 'collaborations' },
  //     { id: 1, title: 'Moderation options', to: 'moderation' }
  //   ]
  // },
  {
    groupId: 2,
    title: t('views:repos.codeAutomation', 'Code and automation'),
    type: MenuGroupTypes.GENERAL,

    items: [
      // { id: 0, text: 'Branches', to: 'branches' },
      // { id: 1, text: 'Tags', to: 'tags' },
      { id: 0, title: t('views:repos.rules', 'Rules'), to: 'rules' },
      // { id: 3, text: 'Actions', to: 'actions' },
      { id: 1, title: t('views:repos.webhooks', 'Webhooks'), to: 'webhooks' }
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

export function SettingsSidebar({ t }: { t: TFunction }) {
  return (
    <SandboxLayout.LeftSubPanel>
      <SandboxLayout.Content className="px-6">
        <RepoSidebar items={getNavItems(t)} />
      </SandboxLayout.Content>
    </SandboxLayout.LeftSubPanel>
  )
}

function SettingsContent() {
  return <Outlet />
}

export function RepoSettingsPage({ useTranslationStore }: { useTranslationStore: () => TranslationStore }) {
  const { t } = useTranslationStore()
  return (
    <SandboxLayout.Main fullWidth>
      <SandboxLayout.Columns columnWidths="auto 1fr">
        <SandboxLayout.Column>
          <SettingsSidebar t={t} />
        </SandboxLayout.Column>
        <SandboxLayout.Column>
          <SettingsContent />
        </SandboxLayout.Column>
      </SandboxLayout.Columns>
    </SandboxLayout.Main>
  )
}
