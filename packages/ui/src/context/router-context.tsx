import {
  Children,
  ComponentPropsWithRef,
  ComponentType,
  createContext,
  forwardRef,
  isValidElement,
  ReactNode,
  useContext
} from 'react'
import type {
  LinkProps,
  Location,
  NavigateFunction,
  NavLinkProps,
  OutletProps,
  Params,
  SetURLSearchParams,
  UIMatch
} from 'react-router-dom'

import { noop } from 'lodash-es'

import { RouterContextProvider as FiltersRouterContextProvider } from '@harnessio/filters'

interface SwitchProps {
  children?: React.ReactNode
  location?: Location
}

const resolveTo = (to: LinkProps['to']) => (typeof to === 'string' ? to : to.pathname || '/')

const LinkDefault = forwardRef<HTMLAnchorElement, LinkProps>(({ to, children, ...props }, ref) => {
  const href = resolveTo(to)
  return (
    <a href={href} {...props} ref={ref}>
      {children}
    </a>
  )
})
LinkDefault.displayName = 'LinkDefault'

const NavLinkDefault = forwardRef<HTMLAnchorElement, NavLinkProps>(
  ({ to, children, className, style, ...props }, ref) => {
    const href = resolveTo(to)
    const isActive = new URL(href, window.location.origin).pathname === window.location.pathname

    const finalClassName =
      typeof className === 'function' ? className({ isActive, isPending: false, isTransitioning: false }) : className

    const finalStyle =
      typeof style === 'function' ? style({ isActive, isPending: false, isTransitioning: false }) : style

    return (
      <a ref={ref} href={href} className={finalClassName} style={finalStyle} {...props}>
        {children}
      </a>
    )
  }
)
NavLinkDefault.displayName = 'NavLinkDefault'

const OutletDefault: ComponentType<OutletProps> = ({ children }) => <>{children}</>

const SwitchDefault: ComponentType<SwitchProps> = ({ children }) => {
  const currentPath = window.location.pathname
  const childrenArray = Children.toArray(children)

  for (const child of childrenArray) {
    if (!isValidElement(child)) continue

    if ('path' in child.props) {
      const pathProp = child.props.path
      if (!pathProp) continue

      const exactProp = !!child.props.exact
      const isMatch = exactProp ? currentPath === pathProp : currentPath.includes(pathProp)

      if (isMatch) return child
    } else {
      return child
    }
  }

  return null
}

interface ExtendedRouteProps {
  path?: string
  exact?: boolean
  render?: (props: object) => ReactNode
  children?: ReactNode
}

const RouteDefault: ComponentType<ExtendedRouteProps> = ({ render, children, ...props }) => {
  if (children) {
    return <>{children}</>
  }

  if (render) {
    return <>{render(props)}</>
  }

  return null
}

const navigateFnDefault: NavigateFunction = to => {
  if (typeof to === 'number') {
    window.history.go(to) // Supports navigate(-1), navigate(1), etc.
  } else {
    window.location.href = to.toString()
  }
}

const useSearchParamsDefault = () => {
  const setSearchParams: SetURLSearchParams = noop
  return [new URLSearchParams(), setSearchParams] as const
}

const useMatchesDefault = (): UIMatch[] => {
  return []
}

const useParamsDefault = (): Params => {
  return {}
}

const defaultLocation: Location = { ...window.location, state: {}, key: '' }

interface RouterContextType {
  Link: ComponentType<ComponentPropsWithRef<typeof LinkDefault>>
  NavLink: ComponentType<ComponentPropsWithRef<typeof NavLinkDefault>>
  Outlet: ComponentType<OutletProps>
  Switch: ComponentType<SwitchProps>
  Route: ComponentType<ExtendedRouteProps>
  location: Location
  navigate: NavigateFunction
  useSearchParams: typeof useSearchParamsDefault
  useMatches: typeof useMatchesDefault
  useParams: typeof useParamsDefault
}

const RouterContext = createContext<RouterContextType>({
  Link: LinkDefault,
  NavLink: NavLinkDefault,
  Outlet: OutletDefault,
  Switch: SwitchDefault,
  Route: RouteDefault,
  location: defaultLocation,
  navigate: navigateFnDefault,
  useSearchParams: useSearchParamsDefault,
  useMatches: useMatchesDefault,
  useParams: useParamsDefault
})

export const useRouterContext = () => useContext(RouterContext)

export const RouterContextProvider = ({
  children,
  Link = LinkDefault,
  NavLink = NavLinkDefault,
  Outlet = OutletDefault,
  Switch = SwitchDefault,
  Route = RouteDefault,
  location = defaultLocation,
  navigate = navigateFnDefault,
  useSearchParams = useSearchParamsDefault,
  useMatches = useMatchesDefault,
  useParams = useParamsDefault
}: {
  children: ReactNode
} & Partial<RouterContextType>) => {
  return (
    <RouterContext.Provider
      value={{
        Link,
        NavLink,
        Outlet,
        Switch,
        Route,
        location,
        navigate,
        useSearchParams,
        useMatches,
        useParams
      }}
    >
      <FiltersRouterContextProvider location={location} navigate={navigate}>
        {children}
      </FiltersRouterContextProvider>
    </RouterContext.Provider>
  )
}

export { NavLinkProps, LinkProps }
