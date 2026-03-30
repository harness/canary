import type { SidebarItemProps } from '@harnessio/ui/components'

export type MoreMenuDrawerItem = Pick<SidebarItemProps, 'to' | 'title' | 'icon'> & { to: string }

export const moreMenuModuleItems: MoreMenuDrawerItem[] = [
  { to: '/drawer/pipelines', title: 'Pipelines', icon: 'pipeline' },
  { to: '/drawer/deployments', title: 'Deployments', icon: 'deployments' },
  { to: '/drawer/builds', title: 'Builds', icon: 'builds' },
  { to: '/drawer/security-tests', title: 'Security tests', icon: 'security-tests' },
  { to: '/drawer/runtime-security', title: 'Runtime security', icon: 'runtime-security' },
  { to: '/drawer/supply-chain', title: 'Supply chain', icon: 'supply-chain' },
  { to: '/drawer/infrastructure', title: 'Infrastructure', icon: 'infrastructure' },
  { to: '/drawer/databases', title: 'Databases', icon: 'databases' },
  { to: '/drawer/artifacts', title: 'Artifacts', icon: 'artifacts' },
  { to: '/drawer/feature-flags', title: 'Feature flags', icon: 'feature-flags' },
  { to: '/drawer/incidents', title: 'Incidents', icon: 'incidents' },
  { to: '/drawer/resilience', title: 'Resilience', icon: 'chaos-tests' },
  { to: '/drawer/cloud-cost', title: 'Cloud cost', icon: 'cloud-costs' },
  { to: '/drawer/insights', title: 'Insights', icon: 'engineering-insights' },
  { to: '/drawer/portal', title: 'Portal', icon: 'portal' },
  { to: '/drawer/testing', title: 'Testing', icon: 'ai-test' }
]
