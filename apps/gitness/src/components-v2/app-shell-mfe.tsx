import { memo, useEffect, useMemo } from 'react'
import { Outlet, useParams } from 'react-router-dom'

import { NavbarItemType } from '@harnessio/ui/components'
import { MainContentLayout } from '@harnessio/ui/views'

import { useNav } from '../components/stores/recent-pinned-nav-links.store'
import { useLocationChange } from '../framework/hooks/useLocationChange'
import { useMFEContext } from '../framework/hooks/useMFEContext'
import { useRepoImportEvents } from '../framework/hooks/useRepoImportEvent'
import { useSelectedSpaceId } from '../framework/hooks/useSelectedSpaceId'
import { useTranslationStore } from '../i18n/stores/i18n-store'
import { AppSidebar } from '../mfe/side-bar'
import { PathParams } from '../RouteDefinitions'
import { getNavbarMenuData } from '../sidebar-data/mfe/navbar-menu-items'
import { getPinnedMenuItemsData } from '../sidebar-data/mfe/pinned-items'
import BreadcrumbsMFE from './breadcrumbs/breadcrumbs-mfe'
import { Toaster } from './toaster'

interface NavLinkStorageInterface {
  state: {
    recent: NavbarItemType[]
    pinned: NavbarItemType[]
  }
}

export const AppShellMFE = memo(() => {
  const { routes } = useMFEContext()
  const { spaceId } = useParams<PathParams>()
  const { pinnedMenu, setRecent, setNavLinks } = useNav()
  const { t } = useTranslationStore()
  const selectedSpaceId = useSelectedSpaceId(spaceId)
  const spaceIdPathParam = spaceId ?? selectedSpaceId ?? ''

  const pinnedMenuItemsData = useMemo(() => getPinnedMenuItemsData({ t, routes }), [t, routes])

  const navMenuItemsData = useMemo(() => getNavbarMenuData({ t, routes }), [t, routes])

  useLocationChange({ t, onRouteChange: setRecent, getNavbarMenuData: () => [] })

  useEffect(() => {
    localStorage.setItem('nav-items', JSON.stringify({ state: { pinned: pinnedMenu, recent: [] } }))
  }, [])

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
     * Pinned links cannot be empty as we will have some links permanantly.
     */
    if (parsedLinksFromStorage && !parsedLinksFromStorage?.state?.pinned?.length) {
      const pinnedItems = pinnedMenu.filter(
        item => !pinnedMenuItemsData.some(staticPinned => staticPinned.id === item.id)
      )
      setNavLinks({ pinnedMenu: [...pinnedMenuItemsData, ...pinnedItems] })
    }
  }, [spaceIdPathParam])

  useRepoImportEvents()

  return (
    <>
      <AppSidebar />
      <MainContentLayout breadcrumbs={<BreadcrumbsMFE />} className="min-h-screen text-foreground-2">
        <Outlet />
      </MainContentLayout>
      <Toaster />
    </>
  )
})

AppShellMFE.displayName = 'AppShellMFE'
