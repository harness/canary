import { NavbarItemType } from '@components/navbar/types'

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
