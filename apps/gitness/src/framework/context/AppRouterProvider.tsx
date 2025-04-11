import { FC, ReactNode } from 'react'
import { Link, NavLink, Outlet, useLocation, useMatches, useNavigate, useSearchParams } from 'react-router-dom'

import { RouterContextProvider } from '@harnessio/ui/context'

interface AppRouterProviderProps {
  children: ReactNode
}

const AppRouterProvider: FC<AppRouterProviderProps> = ({ children }) => {
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
      {children}
    </RouterContextProvider>
  )
}

export { AppRouterProvider }
