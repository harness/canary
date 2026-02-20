import { FC, useEffect, useMemo } from 'react'
import { Outlet, useParams } from 'react-router-dom'

import { NavbarItemType, Toaster, useSidebar } from '@harnessio/ui/components'
import { useTranslation } from '@harnessio/ui/context'
import { MainContentLayout } from '@harnessio/views'

import { getNavbarMenuData } from '../../data/navbar-menu-data'
import { getPinnedMenuItemsData } from '../../data/pinned-items'
import { useRoutes } from '../../framework/context/NavigationContext'
import { useGetSpaceURLParam } from '../../framework/hooks/useGetSpaceParam'
import { useLocationChange } from '../../framework/hooks/useLocationChange'
import { useSelectedSpaceId } from '../../framework/hooks/useSelectedSpaceId'
import useSpaceSSEWithPubSub from '../../framework/hooks/useSpaceSSEWithPubSub'
import { PathParams } from '../../RouteDefinitions'
import { Breadcrumbs } from '../breadcrumbs/breadcrumbs'
import { useGetBreadcrumbs } from '../breadcrumbs/useGetBreadcrumbs'
import { useNav } from '../stores/recent-pinned-nav-links.store'
import { AppSideBar } from './side-bar'

interface NavLinkStorageInterface {
  state: {
    recent: NavbarItemType[]
    pinned: NavbarItemType[]
  }
}

export const AppShell: FC = () => {
  const { isMobile } = useSidebar()
  const routes = useRoutes()
  const { spaceId } = useParams<PathParams>()
  const spaceURL = useGetSpaceURLParam() ?? ''
  const { pinnedMenu, setRecent, setNavLinks } = useNav()
  const { t } = useTranslation()
  const selectedSpaceId = useSelectedSpaceId(spaceId)
  const spaceIdPathParam = spaceId ?? selectedSpaceId ?? ''

  const { breadcrumbs } = useGetBreadcrumbs()

  const pinnedMenuItemsData = useMemo(
    () => getPinnedMenuItemsData({ t, routes, spaceId: spaceIdPathParam }),
    [t, routes, spaceIdPathParam]
  )

  useLocationChange({ onRouteChange: setRecent, getNavbarMenuData })

  useEffect(() => {
    const linksFromStorage = localStorage.getItem('nav-items')
    let parsedLinksFromStorage: NavLinkStorageInterface | undefined

    if (linksFromStorage) {
      parsedLinksFromStorage = JSON.parse(linksFromStorage)
    }

    /**
     * Logic for setting initial pinned links
     *
     * setting initial pinned link only if no pinned links are stored in local storage.
     * Pinned links cannot be empty as we will have some links permanently.
     */
    if (parsedLinksFromStorage && !parsedLinksFromStorage?.state?.pinned?.length) {
      const pinnedItems = pinnedMenu.filter(
        item => !pinnedMenuItemsData.some(staticPinned => staticPinned.id === item.id)
      )
      setNavLinks({ pinnedMenu: [...pinnedMenuItemsData, ...pinnedItems] })
    }
  }, [spaceIdPathParam])

  useSpaceSSEWithPubSub({
    space: spaceURL
  })

  return (
    <>
      <AppSideBar>
        <Breadcrumbs breadcrumbs={breadcrumbs} isMobile={isMobile} withMobileSidebarToggle />
        <MainContentLayout useSidebar={useSidebar} withBreadcrumbs={breadcrumbs.length > 0}>
          <Outlet />
        </MainContentLayout>
      </AppSideBar>
      <Toaster />
    </>
  )
}
