import type { MouseEvent } from 'react'

import type { SidebarItemProps } from '@harnessio/ui/components'

export const workspaceSwitcher: SidebarItemProps = {
  to: '/',
  title: 'Harness',
  description: 'default',
  logo: 'harness' as const,
  withRightIndicator: true as const
}

export const pinnedHomeItem: SidebarItemProps = { to: '/home', title: 'Home', icon: 'view-grid' }

export const recentSectionLabel = 'Recent'

export const demoItems: SidebarItemProps[] = [
  { to: '/repos', title: 'Repositories', icon: 'folder' },
  { to: '/pipelines', title: 'Pipelines', icon: 'play' },
  { to: '/connectors', title: 'Connectors', icon: 'connectors' },
  {
    to: '/account',
    title: 'Account',
    icon: 'user'
  },
  { to: '/settings', title: 'Settings', icon: 'settings' }
]

export const infrastructureNav = {
  parent: { title: 'Infrastructure', icon: 'infrastructure' as const },
  subItems: [
    { to: '/infra/clusters', title: 'Clusters' },
    { to: '/infra/environments', title: 'Environments' }
  ]
} as const

const buildsNavPinAriaLabel = 'Pin'

export const buildsNav = {
  parent: {
    to: '/builds',
    title: 'Builds',
    icon: 'builds' as const,
    actionButtons: [
      {
        iconName: 'pin' as const,
        iconOnly: true,
        onClick: (e: MouseEvent<HTMLButtonElement>) => {
          e.preventDefault()
        },
        'aria-label': buildsNavPinAriaLabel
      }
    ]
  },
  subItems: [
    { to: '/builds/queue', title: 'Queue' },
    { to: '/builds/history', title: 'History' }
  ]
}
