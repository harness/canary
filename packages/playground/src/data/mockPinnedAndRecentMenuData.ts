import { NavbarItemType } from '../components/navbar/types'

export const pinnedMenuItemsData: NavbarItemType[] = [
  {
    id: 0,
    iconName: 'repositories-gradient',
    title: 'Repositories',
    description: 'Integrated & familiar git experience.',
    to: '/repos'
  },
  {
    id: 1,
    iconName: 'pipelines-gradient',
    title: 'Pipelines',
    description: 'Up to 4X faster than other solutions.',
    to: '/pipelines'
  },
  {
    id: 2,
    iconName: 'execution-gradient',
    title: 'Executions',
    description: 'Optimize feature rollout velocity.',
    to: '/executions'
  }
]

export const recentMenuItemsData: NavbarItemType[] = [
  {
    id: 13,
    iconName: 'incidents-gradient',
    title: 'Incidents',
    description: 'Shift left security testing.',
    to: '/incidents'
  },
  {
    id: 15,
    iconName: 'dashboards-gradient',
    title: 'Dashboards',
    description: 'Intelligent cost management.',
    to: '/dashboards'
  },
  {
    id: 20,
    iconName: 'briefcase',
    title: 'Roles',
    to: '/admin/roles'
  }
]
