import { type FC, type ReactNode } from 'react'
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

/** Bridges `react-router-dom` into `@harnessio/ui` so hooks like `useRouterContext` work under `BrowserRouter`. */
export const AppRouterProvider: FC<{ children: ReactNode }> = ({ children }) => {
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
      {children}
    </RouterContextProvider>
  )
}
