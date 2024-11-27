import { NavbarItemType } from '@components/navbar/types'

import { i18nextViewsInstance } from '../i18n/i18n'

const { t } = i18nextViewsInstance

export const getPinnedMenuItemsData = (): NavbarItemType[] => [
  {
    id: 0,
    iconName: 'repositories-gradient',
    title: t('component:navbar.repositories'),
    description: 'Integrated & familiar git experience.',
    to: '/repos'
  },
  {
    id: 1,
    iconName: 'pipelines-gradient',
    title: t('component:navbar.pipelines'),
    description: 'Up to 4X faster than other solutions.',
    to: '/pipelines'
  },
  {
    id: 2,
    iconName: 'execution-gradient',
    title: t('component:navbar.executions'),
    description: 'Optimize feature rollout velocity.',
    to: '/executions'
  }
]
