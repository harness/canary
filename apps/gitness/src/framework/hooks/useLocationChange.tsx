import { useEffect, useMemo } from 'react'
import { useLocation } from 'react-router-dom'

import { MenuGroupType, NavbarItemType } from '@harnessio/ui/components'
import { useTranslation } from '@harnessio/ui/context'

import { GetNavbarMenuData } from '../../data/navbar-menu-data'
import { useRoutes } from '../context/NavigationContext'

const useLocationChange = ({
  onRouteChange,
  getNavbarMenuData
}: {
  onRouteChange: (item: NavbarItemType) => void
  getNavbarMenuData: GetNavbarMenuData
}) => {
  const routeMapping = useRoutes()
  const location = useLocation()
  const { t } = useTranslation()

  const navbarMenuData = useMemo(() => getNavbarMenuData({ t, routes: routeMapping }), [t])

  const routes = useMemo(() => {
    return navbarMenuData.reduce((acc: NavbarItemType[], item: MenuGroupType) => {
      return [...acc, ...item.items]
    }, [])
  }, [navbarMenuData])

  useEffect(() => {
    const currentRoute = routes?.find(route => route.to === location.pathname)

    if (currentRoute) {
      onRouteChange(currentRoute)
    }
  }, [location.pathname, onRouteChange, routes])
}

export { useLocationChange }
