import type { MoreMenuDrawerItem } from './more-menu-module-items'

export const moreMenuResourceItems: MoreMenuDrawerItem[] = [
  { to: '/drawer/agents', title: 'Agents', icon: 'agents' },
  { to: '/drawer/dashboards', title: 'Dashboards', icon: 'dashboard' },
  { to: '/drawer/repositories', title: 'Repositories', icon: 'repository' },
  { to: '/drawer/templates', title: 'Templates', icon: 'templates' },
  { to: '/drawer/monitors', title: 'Monitors', icon: 'monitored-service' },
  { to: '/drawer/services', title: 'Services', icon: 'services' },
  { to: '/drawer/connectors', title: 'Connectors', icon: 'connectors' },
  { to: '/drawer/delegates', title: 'Delegates', icon: 'delegates' },
  { to: '/settings', title: 'Settings', icon: 'settings' }
]
