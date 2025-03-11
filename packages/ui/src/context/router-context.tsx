import { ComponentType, createContext, ReactNode, useContext } from 'react'
import type {
  LinkProps,
  Location,
  NavigateFunction,
  NavLinkProps,
  OutletProps,
  Params,
  UIMatch
} from 'react-router-dom'

const resolveTo = (to: LinkProps['to']) => (typeof to === 'string' ? to : to.pathname || '/')

const LinkDefault = ({ to, children, ...props }: LinkProps) => {
  const href = resolveTo(to)
  return (
    <a href={href} {...props}>
      {children}
    </a>
  )
}

const NavLinkDefault = ({ to, children, className, style, ...props }: NavLinkProps) => {
  const href = resolveTo(to)
  const isActive = new URL(href, window.location.origin).pathname === window.location.pathname

  const finalClassName =
    typeof className === 'function' ? className({ isActive, isPending: false, isTransitioning: false }) : className

  const finalStyle = typeof style === 'function' ? style({ isActive, isPending: false, isTransitioning: false }) : style

  return (
    <a href={href} className={finalClassName} style={finalStyle} {...props}>
      {children}
    </a>
  )
}

const OutletDefault: ComponentType<OutletProps> = ({ children }) => <>{children}</>

const navigateFnDefault: NavigateFunction = to => {
  if (typeof to === 'number') {
    window.history.go(to) // Supports navigate(-1), navigate(1), etc.
  } else {
    window.location.href = to.toString()
  }
}

const useSearchParamsDefault = () => {
  const setSearchParams = (_params: URLSearchParams | ((currentParams: URLSearchParams) => URLSearchParams)): void => {}
  return [new URLSearchParams(), setSearchParams] as const
}

const useMatchesDefault = (): UIMatch[] => {
  return []
}

const useParamsDefault = <ParamsOrKey extends string | Record<string, string | undefined> = string>(): Readonly<
  [ParamsOrKey] extends [string] ? Params<ParamsOrKey> : Partial<ParamsOrKey>
> => {
  return {} as any
}

const defaultLocation: Location = { ...window.location, state: {}, key: '' }

interface RouterContextType {
  Link: ComponentType<LinkProps>
  NavLink: ComponentType<NavLinkProps>
  Outlet: ComponentType<OutletProps>
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
        location,
        navigate,
        useSearchParams,
        useMatches,
        useParams
      }}
    >
      {children}
    </RouterContext.Provider>
  )
}
