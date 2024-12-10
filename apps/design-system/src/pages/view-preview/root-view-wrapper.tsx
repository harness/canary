import { FC, PropsWithChildren, useCallback, useState } from 'react'
import { Route, Routes } from 'react-router-dom'

import { NavbarItemType, NavState } from '@harnessio/ui/components'
import { SandboxRoot } from '@harnessio/ui/views'

import { mockT, noop } from '../../utils.ts'

const RootViewWrapper: FC<PropsWithChildren<{ asChild?: boolean }>> = ({ children, asChild = false }) => {
  const [pinnedMenu, setPinnedMenu] = useState<NavbarItemType[]>([])
  const [recentMenu, setRecentMenu] = useState<NavbarItemType[]>([])

  const setPinned = useCallback((item: NavbarItemType, pin: boolean) => {
    setPinnedMenu(current => (pin ? [...current, item] : current.filter(pinnedItem => pinnedItem !== item)))
  }, [])

  const setRecent = useCallback((item: NavbarItemType, remove?: boolean) => {
    setRecentMenu(current => (!remove ? [...current, item] : current.filter(recentItem => recentItem !== item)))
  }, [])

  const setNavLinks = useCallback((links: Parameters<NavState['setNavLinks']>[0]) => {
    if (links.pinnedMenu) setPinnedMenu(links.pinnedMenu)
    if (links.recentMenu) setRecentMenu(links.recentMenu)
  }, [])

  const useNav = useCallback(
    () => ({
      pinnedMenu,
      recentMenu,
      setPinned,
      setRecent,
      setNavLinks
    }),
    [pinnedMenu, recentMenu, setNavLinks, setPinned, setRecent]
  )

  return (
    <Routes>
      <Route path="*" element={<SandboxRoot useNav={useNav} currentUser={undefined} logout={noop} t={mockT as any} />}>
        {asChild ? children : <Route path="*" element={children} />}
      </Route>
    </Routes>
  )
}

export default RootViewWrapper
