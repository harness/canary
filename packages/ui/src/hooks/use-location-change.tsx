import { useEffect, useMemo } from 'react'
import { useLocation } from 'react-router-dom'

import { getNavbarMenuData } from '@/data/navbar-menu-data'
import { MenuGroupType, NavbarItemType } from '@components/navbar/types'
import { TFunction } from 'i18next'

const useLocationChange = ({ t, onRouteChange }: { t: TFunction; onRouteChange: (item: NavbarItemType) => void }) => {
  const location = useLocation()

  const navbarMenuData = useMemo(() => getNavbarMenuData(t), [t])

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
