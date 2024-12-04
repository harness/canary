import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import type { NavbarItemIdType } from '@harnessio/ui/components'
import { SandboxRoot } from '@harnessio/ui/views'

import { useAppContext } from '../framework/context/AppContext'

const RootWrapper = () => {
  const { currentUser } = useAppContext()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const [recentRouteIDs, setRecentRouteIDs] = useState<NavbarItemIdType[]>([])
  const [pinnedRoutes, setPinnedRoutes] = useState<NavbarItemIdType[] | null>(null)

  const handleChangeRecentMenu = useCallback((updatedRecentMenuIDs: NavbarItemIdType[]) => {
    setRecentRouteIDs([...new Set(updatedRecentMenuIDs)])
  }, [])

  const handleChangePinnedMenu = useCallback((updatedPinnedMenuIDs: NavbarItemIdType[]) => {
    setPinnedRoutes([...new Set(updatedPinnedMenuIDs)])
  }, [])

  return (
    <>
      <SandboxRoot
        logout={() => navigate('/logout')}
        currentUser={currentUser}
        pinnedMenu={pinnedRoutes}
        recentMenu={recentRouteIDs}
        changePinnedMenu={handleChangePinnedMenu}
        changeRecentMenu={handleChangeRecentMenu}
        t={t}
      />
    </>
  )
}

export default RootWrapper
