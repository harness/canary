import { Link, useNavigate } from 'react-router-dom'

import { LandingPageView } from '@harnessio/views'

import { useAppContext } from '../framework/context/AppContext'
import { useRoutes } from '../framework/context/NavigationContext'

export const LandingPage = () => {
  const routes = useRoutes()
  const { spaces } = useAppContext()
  const navigate = useNavigate()

  return (
    <LandingPageView
      spaces={spaces}
      getProjectPath={spaceId => routes.toRepositories({ spaceId })}
      toCreateProject={() => routes.toProjectCreate()}
      navigate={navigate}
      Link={Link}
    />
  )
}
