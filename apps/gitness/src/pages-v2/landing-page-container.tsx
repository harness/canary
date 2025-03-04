import { LandingPageView } from '@harnessio/ui/views'

import { useAppContext } from '../framework/context/AppContext'
import { useRoutes } from '../framework/context/NavigationContext'
import { useTranslationStore } from '../i18n/stores/i18n-store'

export const LandingPage = () => {
  const routes = useRoutes()
  const { spaces } = useAppContext()

  const getProjectPath = (spaceId?: string) => routes.toRepositories({ spaceId })

  return (
    <LandingPageView
      spaces={spaces}
      useTranslationStore={useTranslationStore}
      getProjectPath={getProjectPath}
      toCreateProject={() => routes.toProjectCreate()}
    />
  )
}
