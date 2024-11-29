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
  const [recentRoutesIDs, setRecentRoutesIDs] = useState<any[]>([])

  const handleChangeRecentMenu = useCallback(updatedRecentMenuIDs => {
    setRecentRoutesIDs(_currentRecentIDs => {
      return [...new Set([...updatedRecentMenuIDs])]
    })
  }, [])

  console.log('recentRoutesIDs', recentRoutesIDs)

  return (
    <>
      <SandboxRoot
        logout={() => navigate('/logout')}
        currentUser={currentUser}
        pinnedMenu={null}
        recentMenu={recentRoutesIDs}
        changePinnedMenu={_data => {}}
        changeRecentMenu={handleChangeRecentMenu}
        t={t}
      />
    </>
  )
}

export default RootWrapper
