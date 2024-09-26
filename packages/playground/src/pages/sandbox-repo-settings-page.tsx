import React, { useState } from 'react'
import { PlaygroundListSettings } from '../settings/list-settings'
import { SandboxLayout } from '../index'
import { Navbar, Text, Spacer } from '@harnessio/canary'
import { NavLink, Outlet } from 'react-router-dom'

const navItems = [
  {
    id: 0,
    groupTitle: null,
    items: [{ id: 0, text: 'General', to: 'general' }]
  },
  {
    id: 1,
    groupTitle: 'Access',
    items: [
      { id: 0, text: 'Collaborations', to: 'collaborations' },
      { id: 1, text: 'Moderation options', to: 'moderation' }
    ]
  },
  {
    id: 2,
    groupTitle: 'Code and automation',
    items: [
      { id: 0, text: 'Branches', to: 'branches' },
      { id: 1, text: 'Tags', to: 'tags' },
      { id: 2, text: 'Rules', to: 'rules' },
      { id: 3, text: 'Actions', to: 'actions' },
      { id: 4, text: 'Webhooks', to: 'webhooks' },
      { id: 5, text: 'Environments', to: 'environments' },
      { id: 6, text: 'Codespaces', to: 'codespaces' },
      { id: 7, text: 'Pages', to: 'pages' }
    ]
  },
  {
    id: 3,
    groupTitle: 'Security',
    items: [
      { id: 0, text: 'Code security and analysis', to: 'code-security' },
      { id: 1, text: 'Deploy keys', to: 'deploy-keys' },
      { id: 2, text: 'Secrets and variables', to: 'secrets-variables' }
    ]
  },
  {
    id: 4,
    groupTitle: 'Notifications',
    items: [{ id: 0, text: 'Email notifications', to: 'email-notifications' }]
  }
]

function Sidebar() {
  return (
    <SandboxLayout.Content>
      <Navbar.Root className="bg-transparent border-none">
        <Navbar.Content>
          {navItems.map(group => (
            <Navbar.Group
              key={`group-${group.id}`}
              title={group.groupTitle || ''}
              topBorder={group.groupTitle ? true : false}>
              {group.items.map(item => (
                <NavLink key={`group-${group.id}-item-${item.id}`} to={item.to}>
                  {({ isActive }) => <Navbar.Item submenuItem text={item.text} active={isActive} />}
                </NavLink>
              ))}
            </Navbar.Group>
          ))}
        </Navbar.Content>
      </Navbar.Root>
    </SandboxLayout.Content>
  )
}

function SettingsContent() {
  return (
    <SandboxLayout.Content>
      <Spacer size={4} />
      <Text size={5} weight={'medium'}>
        Settings
      </Text>
      <Spacer size={8} />
      <Outlet />
    </SandboxLayout.Content>
  )
}

function SandboxRepoSettingsPage() {
  const [loadState, setLoadState] = useState('data-loaded')

  return (
    <SandboxLayout.Main hasHeader hasSubHeader hasLeftPanel>
      <SandboxLayout.Columns columnWidths="auto 1fr">
        <SandboxLayout.Column>
          <Sidebar />
        </SandboxLayout.Column>
        <SandboxLayout.Column>
          <SettingsContent />
        </SandboxLayout.Column>
      </SandboxLayout.Columns>
      <PlaygroundListSettings loadState={loadState} setLoadState={setLoadState} />
    </SandboxLayout.Main>
  )
}

export { SandboxRepoSettingsPage, navItems }
