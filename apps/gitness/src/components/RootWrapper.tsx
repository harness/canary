import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { SandboxRoot } from '@harnessio/ui/views'

import { useAppContext } from '../framework/context/AppContext'

const RootWrapper = () => {
  const { currentUser } = useAppContext()
  const navigate = useNavigate()
  const { t } = useTranslation()

  // Update type
  const [recentRouteIDs, setRecentRouteIDs] = useState<any[]>([])
  const [pinnedRoutes, setPinnedRoutes] = useState<any[] | null>(null)

  const handleChangeRecentMenu = useCallback((updatedRecentMenuIDs: Iterable<unknown> | null | undefined) => {
    setRecentRouteIDs([...new Set(updatedRecentMenuIDs)])
  }, [])

  const handleChangePinnedMenu = useCallback((updatedPinnedMenuIDs: Iterable<unknown> | null | undefined) => {
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
