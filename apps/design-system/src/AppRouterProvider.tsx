import { FC } from 'react'
import { Link, NavLink, Outlet, useLocation, useMatches, useNavigate, useSearchParams } from 'react-router-dom'

import { RouterContextProvider } from '@harnessio/ui/context'

const AppRouterProvider: FC = () => {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <RouterContextProvider
      Link={Link}
      NavLink={NavLink}
      Outlet={Outlet}
      location={location}
      navigate={navigate}
      useSearchParams={useSearchParams}
      useMatches={useMatches}
    >
      <Outlet />
    </RouterContextProvider>
  )
}

export default AppRouterProvider
