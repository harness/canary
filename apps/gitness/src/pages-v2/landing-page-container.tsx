import { LandingPageView } from '@harnessio/ui/views'

import { useAppContext } from '../framework/context/AppContext'
import { useRoutes } from '../framework/context/NavigationContext'

export const LandingPage = () => {
  const routes = useRoutes()
  const { spaces } = useAppContext()

  const getProjectPath = (spaceId?: string) => routes.toRepositories({ spaceId })

  return (
    <LandingPageView spaces={spaces} getProjectPath={getProjectPath} toCreateProject={() => routes.toProjectCreate()} />
  )
}
