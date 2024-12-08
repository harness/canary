import { NavbarItemType } from '@components/navbar/types'
import { TFunction } from 'i18next'

export const getPinnedMenuItemsData = (t: TFunction): NavbarItemType[] => [
  {
    id: 0,
    iconName: 'repositories-gradient',
    title: t('component:navbar.repositories'),
    description: 'Integrated & familiar git experience.',
    to: '/repos',
    permanentlyPinned: true
  },
  {
    id: 1,
    iconName: 'pipelines-gradient',
    title: t('component:navbar.pipelines'),
    description: 'Up to 4X faster than other solutions.',
    to: '/pipelines',
    permanentlyPinned: true
  }
]
