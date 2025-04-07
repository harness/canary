import { TFunction } from 'i18next'

import { MenuGroupType, MenuGroupTypes } from '@harnessio/ui/components'

import { RouteDefinitions } from '../../framework/context/MFEContext'

export type GetNavbarMenuDataParams = {
  t: TFunction
  routes: Partial<RouteDefinitions>
}

export type GetNavbarMenuData = ({ t, routes }: GetNavbarMenuDataParams) => MenuGroupType[]

export const getNavbarMenuData: GetNavbarMenuData = ({ t, routes }) => [
  {
    groupId: 0,
    title: t('component:navbar.devops'),
    type: MenuGroupTypes.GENERAL,
    items: [
      {
        id: 0,
        iconName: 'repositories-gradient',
        title: t('component:navbar.repositories'),
        description: 'Integrated & familiar git experience.',
        to: routes?.toRepositories?.() || ''
      },
      {
        id: 1,
        iconName: 'pipelines-gradient',
        title: t('component:navbar.pipelines'),
        description: 'Up to 4X faster than other solutions.',
        to: routes?.toPipelines?.() || ''
      }
    ]
  }
]
