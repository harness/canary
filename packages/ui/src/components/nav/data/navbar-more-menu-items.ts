import { MenuGroupTypes, NavbarItemType } from '@/components'
import { ScopeType } from '@/views'

import { GetNavbarMenuData, NavEnum } from '../types'

export const NavItems: Map<NavEnum, Omit<NavbarItemType, 'to'>> = new Map([
  [
    NavEnum.Home,
    {
      id: NavEnum.Home,
      iconName: 'dashboard',
      title: 'Home',
      permanentlyPinned: true
    }
  ],
  [
    NavEnum.Activities,
    {
      id: NavEnum.Activities,
      iconName: 'ai',
      title: 'Activity',
      permanentlyPinned: true
    }
  ],
  [
    NavEnum.Settings,
    {
      id: NavEnum.Settings,
      iconName: 'settings',
      title: 'Settings',
      description: 'Account Settings',
      permanentlyPinned: true
    }
  ]
])

export const getNavbarMoreMenuData: GetNavbarMenuData = ({ t, routes, params }) => [
  {
    groupId: 0,
    title: t('component:navbar.devops', 'DevOps'),
    type: MenuGroupTypes.GENERAL,
    items: [
      {
        id: 1,
        iconName: 'pipeline',
        title: 'Pipelines',
        description: 'Up to 4X faster than other solutions.',
        to: routes?.toPipelines?.(params) || ''
      },
      {
        id: 2,
        iconName: 'database',
        title: t('component:navbar.databases', 'Databases'),
        description: 'Manage all your infrastructure.',
        to: routes?.toDatabases?.(params) || ''
      },
      {
        id: 3,
        iconName: 'deployments',
        title: t('component:navbar.deployments', 'Deployments'),
        description: 'Automate and manage your deployments.',
        to: routes?.toDeployments?.(params) || ''
      },
      {
        id: 4,
        iconName: 'artifacts',
        title: t('component:navbar.artifacts', 'Artifacts'),
        description: 'Store and manage build artifacts.',
        to: routes?.toArtifacts?.(params) || ''
      },
      {
        id: 5,
        iconName: 'builds',
        title: t('component:navbar.builds', 'Builds'),
        description: 'Continuous integration and build pipelines.',
        to: routes?.toBuilds?.(params) || ''
      },
      {
        id: 6,
        iconName: 'portal',
        title: t('component:navbar.developer-portal', 'Developer Portal'),
        description: 'Built for developers, onboard in minutes.',
        to: routes?.toDeveloperPortal?.(params) || ''
      },
      {
        id: 7,
        iconName: 'repository',
        title: t('component:navbar.repositories', 'Repositories'),
        description: 'Integrated & familiar git experience.',
        to: routes?.toRepositories?.(params) || ''
      },
      {
        id: 8,
        iconName: 'workspaces',
        title: t('component:navbar.developer-environments', 'Developer Environments'),
        description: 'Integrated & familiar git experience.',
        to: routes?.toDeveloperEnvironments?.(params) || ''
      },
      {
        id: 9,
        iconName: 'infrastructure',
        title: t('component:navbar.infrastructure', 'Infrastructure'),
        description: 'Manage all your infrastructure.',
        to: routes?.toInfrastructure?.(params) || ''
      },
      {
        id: 10,
        iconName: 'ai-ml-ops',
        title: t('component:navbar.ai-ml-ops', 'AI / ML Ops'),
        description: 'Operationalize and manage AI/ML workflows.',
        to: routes?.toAiMlOps?.(params) || ''
      }
    ]
  },
  {
    groupId: 1,
    title: t('component:navbar.testing', 'Testing'),
    type: MenuGroupTypes.GENERAL,
    items: [
      {
        id: 11,
        iconName: 'feature-flags',
        title: t('component:navbar.featureFlags.mainTitle', 'Feature Flags'),
        description: 'Manage all your infrastructure.',
        to: routes?.toFeatureFlags?.(params) || '',
        subItems: [
          {
            id: 11.1,
            iconName: 'feature-flags',
            title: t('component:navbar.featureFlags.targetGroups', 'Target groups'),
            description: 'To manage target groups',
            to: routes?.toFeatureFlagsTargetGroups?.(params) || ''
          }
        ]
      },
      {
        id: 12,
        iconName: 'warning-triangle',
        title: t('component:navbar.incidents', 'Incidents'),
        description: 'Shift left security testing.',
        to: routes?.toIncidents?.(params) || ''
      },
      {
        id: 13,
        iconName: 'chaos-tests',
        title: t('component:navbar.chaos-engineering', 'Chaos Engineering'),
        description: 'Validate service resilience.',
        to: routes?.toChaosEngineering?.(params) || ''
      }
    ]
  },
  {
    groupId: 2,
    title: t('component:navbar.security', 'Security'),
    type: MenuGroupTypes.GENERAL,
    items: [
      {
        id: 14,
        iconName: 'security-tests',
        title: t('component:navbar.security-tests', 'Security Tests'),
        description: 'Shift left security testing.',
        to: routes?.toSecurityTests?.(params) || ''
      },
      {
        id: 15,
        iconName: 'runtime-security',
        title: t('component:navbar.runtime-security', 'Runtime Security'),
        description: 'Protect workloads at runtime.',
        to: routes?.toRuntimeSecurity?.(params) || ''
      },
      {
        id: 16,
        iconName: 'supply-chain',
        title: t('component:navbar.supply-chain', 'Supply Chain'),
        description: 'Artifact integrity and governance.',
        to: routes?.toSupplyChain?.(params) || ''
      }
    ]
  },
  {
    groupId: 3,
    title: t('component:navbar.efficiency', 'Efficiency'),
    type: MenuGroupTypes.GENERAL,
    items: [
      {
        id: 17,
        iconName: 'cloud-costs',
        title: t('component:navbar.cloud-costs', 'Cloud Costs'),
        description: 'Intelligent cost management.',
        to: routes?.toCloudCosts?.(params) || ''
      },
      {
        id: 18,
        iconName: 'engineering-insights',
        title: 'Engineerings Insights',
        description: 'Actionable insights on SDLC.',
        to: routes?.toDeveloperInsights?.(params) || ''
      }
    ]
  },
  {
    groupId: 4,
    title: t('component:navbar.platform', 'Platform'),
    type: MenuGroupTypes.GENERAL,
    items: [
      {
        id: 19,
        iconName: 'dashboard',
        title: t('component:navbar.dashboards', 'Dashboards'),
        description: 'Intelligent cost management.',
        to: routes?.toDashboards?.(params) || ''
      },
      {
        id: 20,
        iconName: 'account',
        title: t('component:navbar.account', 'Account'),
        description: 'Manage your account settings.',
        to: routes?.toAccount?.(params) || ''
      },
      {
        id: 21,
        iconName: 'organizations',
        title: t('component:navbar.organization', 'Organization'),
        description: 'Manage your organization settings.',
        to: routes?.toOrganization?.(params) || '',
        scopes: [ScopeType.Organization, ScopeType.Project]
      }
    ]
  }
]
