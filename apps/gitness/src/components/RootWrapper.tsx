import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { SandboxRoot } from '@harnessio/ui/views'

import { useAppContext } from '../framework/context/AppContext'

const RootWrapper = () => {
  const { currentUser } = useAppContext()
  const navigate = useNavigate()
  const { t } = useTranslation()
  return (
    <>
      <SandboxRoot
        logout={() => navigate('/logout')}
        currentUser={currentUser}
        pinnedMenu={null}
        recentMenu={[]}
        changePinnedMenu={_data => {}}
        changeRecentMenu={_data => {}}
        t={t}
      />
    </>
  )
}

export default RootWrapper
