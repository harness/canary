import { TFunction } from 'i18next'

import { MenuGroupType, MenuGroupTypes } from '@harnessio/ui/components'

import { RouteDefinitions, Scope } from '../../framework/context/MFEContext'

export type GetNavbarMenuDataParams = {
  t: TFunction
  routes: Partial<RouteDefinitions>
  scope: Scope
}

export type GetNavbarMenuData = ({ t, routes }: GetNavbarMenuDataParams) => MenuGroupType[]

export const getNavbarMenuData: GetNavbarMenuData = ({ t, routes, scope }) => {
  return [
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
          to:
            routes?.toRepositories?.({
              space: [scope?.accountId, scope?.orgIdentifier, scope?.projectIdentifier].join('/')
            }) || ''
        },
        {
          id: 1,
          iconName: 'pipelines-gradient',
          title: t('component:navbar.pipelines'),
          description: 'Up to 4X faster than other solutions.',
          to:
            routes?.toPipelines?.({
              accountId: scope?.accountId || '',
              orgIdentifier: scope?.orgIdentifier,
              projectIdentifier: scope?.projectIdentifier,
              mode: 'all'
            }) || ''
        }
      ]
    }
  ]
}
