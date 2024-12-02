import { NavbarItemType } from '@components/navbar/types'
import { TFunction } from 'i18next'

export const getPinnedMenuItemsData = (t: TFunction): NavbarItemType[] => [
  {
    id: 800,
    iconName: 'repositories-gradient',
    title: t('component:navbar.repositories'),
    description: 'Integrated & familiar git experience.',
    to: '/v1/repos'
  }
  // {
  //   id: 1,
  //   iconName: 'pipelines-gradient',
  //   title: t('component:navbar.pipelines'),
  //   description: 'Up to 4X faster than other solutions.',
  //   to: '/v1/pipelines'
  // },
  // {
  //   id: 2,
  //   iconName: 'execution-gradient',
  //   title: t('component:navbar.executions'),
  //   description: 'Optimize feature rollout velocity.',
  //   to: '/executions'
  // }
]
