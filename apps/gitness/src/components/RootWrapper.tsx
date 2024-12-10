import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { SandboxRoot } from '@harnessio/ui/views'

import { useAppContext } from '../framework/context/AppContext'
import { useNav } from './stores/recent-pinned-nav-links.store'

const RootWrapper = () => {
  const { currentUser } = useAppContext()
  const navigate = useNavigate()
  const { t } = useTranslation()

  return <SandboxRoot t={t} currentUser={currentUser} useNav={useNav} logout={() => navigate('/logout')} />
}

export default RootWrapper
