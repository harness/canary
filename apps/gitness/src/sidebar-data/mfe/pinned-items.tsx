import { type TFunction } from 'i18next'

import { type NavbarItemType } from '@harnessio/ui/components'

import { RouteDefinitions } from '../../framework/context/MFEContext'

export const getPinnedMenuItemsData = ({
  t,
  routes
}: {
  t: TFunction
  routes?: Partial<RouteDefinitions>
}): NavbarItemType[] => [
  {
    id: 0,
    iconName: 'repositories-gradient',
    title: t('component:navbar.repositories'),
    description: 'Integrated & familiar git experience.',
    to: routes?.toRepositories?.() || '',
    permanentlyPinned: true
  },
  {
    id: 1,
    iconName: 'pipelines-gradient',
    title: t('component:navbar.pipelines'),
    description: 'Up to 4X faster than other solutions.',
    to: routes?.toPipelines?.() || '',
    permanentlyPinned: true
  }
]
