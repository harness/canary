import { Outlet } from 'react-router-dom'

import { SandboxLayout } from '@/views'
import { MenuGroupTypes } from '@components/navbar/types'

import { RepoSidebar } from './components/repo-sidebar'

export const navItems = [
  {
    groupId: 0,
    title: 'General',
    type: MenuGroupTypes.GENERAL,

    items: [{ id: 0, title: 'General Settings', to: 'general' }]
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
    title: 'Code and automation',
    type: MenuGroupTypes.GENERAL,

    items: [
      // { id: 0, text: 'Branches', to: 'branches' },
      // { id: 1, text: 'Tags', to: 'tags' },
      { id: 0, title: 'Rules', to: 'rules' },
      // { id: 3, text: 'Actions', to: 'actions' },
      { id: 1, title: 'Webhooks', to: 'webhooks' }
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

function Sidebar() {
  return (
    <SandboxLayout.LeftSubPanel>
      <SandboxLayout.Content className="px-6">
        <RepoSidebar items={navItems} />
      </SandboxLayout.Content>
    </SandboxLayout.LeftSubPanel>
  )
}

function SettingsContent() {
  return <Outlet />
}

export function RepoSettingsPage() {
  return (
    <SandboxLayout.Main fullWidth>
      <SandboxLayout.Columns columnWidths="auto 1fr">
        <SandboxLayout.Column>
          <Sidebar />
        </SandboxLayout.Column>
        <SandboxLayout.Column>
          <SettingsContent />
        </SandboxLayout.Column>
      </SandboxLayout.Columns>
    </SandboxLayout.Main>
  )
}
