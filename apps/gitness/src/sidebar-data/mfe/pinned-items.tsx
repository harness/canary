import { type TFunction } from 'i18next'

import { type NavbarItemType } from '@harnessio/ui/components'

import { RouteDefinitions, Scope } from '../../framework/context/MFEContext'

export const getPinnedMenuItemsData = ({
  t,
  routes,
  scope
}: {
  t: TFunction
  routes?: Partial<RouteDefinitions>
  scope?: Scope
}): NavbarItemType[] => {
  return [
    {
      id: 0,
      iconName: 'repositories-gradient',
      title: t('component:navbar.repositories'),
      description: 'Integrated & familiar git experience.',
      to:
        routes?.toRepositories?.({
          space: [scope?.accountId, scope?.orgIdentifier, scope?.projectIdentifier].join('/')
        }) || '',
      permanentlyPinned: true
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
        }) || '',
      permanentlyPinned: true
    }
  ]
}
