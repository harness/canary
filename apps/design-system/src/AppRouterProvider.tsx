import { FC } from 'react'
import {
  Link,
  NavLink,
  Outlet,
  useLocation,
  useMatches,
  useNavigate,
  useParams,
  useSearchParams
} from 'react-router-dom'

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
      useParams={useParams}
    >
      <Outlet />
    </RouterContextProvider>
  )
}

export default AppRouterProvider
