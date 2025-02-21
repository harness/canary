import { useNavigate } from 'react-router-dom'

import { LandingPageView } from '@harnessio/ui/views'

import { useAppContext } from '../framework/context/AppContext'
import { useRoutes } from '../framework/context/NavigationContext'
import { useTranslationStore } from '../i18n/stores/i18n-store'

export const LandingPage = () => {
  const routes = useRoutes()
  const navigate = useNavigate()
  const { spaces } = useAppContext()

  const onProjectSelect = (spacePath?: string) => navigate(`${spacePath}/repos`)
  const onProjectCreate = () => navigate(routes.toProjectCreate())

  return (
    <LandingPageView
      spaces={spaces}
      useTranslationStore={useTranslationStore}
      onProjectSelect={onProjectSelect}
      onProjectCreate={onProjectCreate}
    />
  )
}
