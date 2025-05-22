import { NavbarItemType } from '@harnessio/ui/components'
import { TFunctionWithFallback } from '@harnessio/ui/context'

import { RouteFunctionMap } from '../framework/routing/types'

export const getPinnedMenuItemsData = ({
  t,
  spaceId,
  routes
}: {
  t: TFunctionWithFallback
  routes: RouteFunctionMap
  spaceId?: string
}): NavbarItemType[] => [
  {
    id: 0,
    iconName: 'repositories-gradient',
    title: t('component:navbar.repositories'),
    description: 'Integrated & familiar git experience.',
    to: routes.toRepositories({ spaceId }),
    permanentlyPinned: true
  }
  // {
  //   id: 1,
  //   iconName: 'pipelines-gradient',
  //   title: t('component:navbar.pipelines'),
  //   description: 'Up to 4X faster than other solutions.',
  //   to: routes.toPipelines(),
  //   permanentlyPinned: true
  // }
]
