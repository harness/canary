import { NavbarItemType } from '@components/navbar/types'

import { i18nextViewsInstance } from '../i18n/i18n'

export const getPinnedMenuItemsData = (): NavbarItemType[] => [
  {
    id: 0,
    iconName: 'repositories-gradient',
    title: i18nextViewsInstance.t('component:navbar.repositories'),
    description: 'Integrated & familiar git experience.',
    to: '/repos'
  },
  {
    id: 1,
    iconName: 'pipelines-gradient',
    title: i18nextViewsInstance.t('component:navbar.pipelines'),
    description: 'Up to 4X faster than other solutions.',
    to: '/pipelines'
  },
  {
    id: 2,
    iconName: 'execution-gradient',
    title: i18nextViewsInstance.t('component:navbar.executions'),
    description: 'Optimize feature rollout velocity.',
    to: '/executions'
  }
]
