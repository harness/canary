import { useNavigate } from 'react-router-dom'

import { SandboxRoot } from '@harnessio/ui/views'

import { useAppContext } from '../framework/context/AppContext'
import { useThemeStore } from '../framework/context/ThemeContext'
import { useTranslationStore } from '../i18n/stores/i18n-store'
import { useNav } from './stores/recent-pinned-nav-links.store'

const RootWrapper = () => {
  const { currentUser } = useAppContext()
  const navigate = useNavigate()

  return (
    <SandboxRoot
      currentUser={currentUser}
      useNav={useNav}
      useThemeStore={useThemeStore}
      useTranslationStore={useTranslationStore}
      logout={() => navigate('/logout')}
    />
  )
}

export default RootWrapper
