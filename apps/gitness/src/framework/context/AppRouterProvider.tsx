import { FC, ReactNode, useCallback, useContext } from 'react'
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

import { RouterContextProvider as FiltersRouterContextProvider } from '@harnessio/filters'
import { RouterContextProvider } from '@harnessio/ui/context'

import { MFEContext } from './MFEContext'

interface AppRouterProviderProps {
  children: ReactNode
}

const SHELL_BASENAME = '/ng'

const AppRouterProvider: FC<AppRouterProviderProps> = ({ children }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { customUtils } = useContext(MFEContext)

  const navigateToRoute = useCallback(
    (path: string) => {
      // customUtils.navigate is the shell's history.push which expects paths relative to the
      // shell's basename ("/ng"). Strip it so "/ng/account/..." becomes "/account/...".
      const relativePath = path.startsWith(SHELL_BASENAME) ? path.slice(SHELL_BASENAME.length) : path
      customUtils?.navigate?.(relativePath)
    },
    [customUtils]
  )

  return (
    <RouterContextProvider
      Link={Link}
      NavLink={NavLink}
      Outlet={Outlet}
      location={location}
      navigate={navigate}
      navigateToRoute={customUtils?.navigate ? navigateToRoute : undefined}
      useSearchParams={useSearchParams}
      useMatches={useMatches}
      useParams={useParams}
    >
      <FiltersRouterContextProvider location={location} navigate={navigate}>
        {children}
      </FiltersRouterContextProvider>
    </RouterContextProvider>
  )
}

export { AppRouterProvider }
