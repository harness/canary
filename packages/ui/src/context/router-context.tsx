import { ComponentType, createContext, CSSProperties, ReactNode, useContext } from 'react'

export interface LinkProps {
  to: string | { pathname: string }
  className?: string
  children?: ReactNode
  onClick?: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void
  [key: string]: unknown
}

interface NavLinkStateProps {
  isActive: boolean
  isPending: boolean
  isTransitioning: boolean
}

export interface NavLinkProps {
  to: string | { pathname: string }
  style?: CSSProperties | ((props: NavLinkStateProps) => CSSProperties)
  className?: string | ((props: NavLinkStateProps) => string)
  children?: ReactNode | ((props: NavLinkStateProps) => ReactNode)
  onClick?: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void
  [key: string]: unknown
}

interface OutletProps {
  children?: ReactNode
}

interface Match {
  id: string
  pathname: string
  params: Record<string, string>
  pathnameBase: string
}

type NavigateFunction = (to: string | number) => void

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
    window.history.go(to)
  } else {
    window.location.href = to.toString()
  }
}

const useSearchParamsDefault = () => {
  const setSearchParams = (_params: URLSearchParams | ((currentParams: URLSearchParams) => URLSearchParams)): void => {}
  return [new URLSearchParams(), setSearchParams] as const
}

const useMatchesDefault = (): Match[] => {
  return []
}

interface RouterContextType {
  Link: ComponentType<LinkProps>
  NavLink: ComponentType<NavLinkProps>
  Outlet: ComponentType<OutletProps>
  navigate: NavigateFunction
  location: Location
  useSearchParams: typeof useSearchParamsDefault
  useMatches: typeof useMatchesDefault
}

const RouterContext = createContext<RouterContextType>({
  Link: LinkDefault,
  NavLink: NavLinkDefault,
  Outlet: OutletDefault,
  navigate: navigateFnDefault,
  location: window.location,
  useSearchParams: useSearchParamsDefault,
  useMatches: useMatchesDefault
})

export const useRouterContext = () => useContext(RouterContext)

export const RouterContextProvider = ({
  children,
  Link = LinkDefault,
  NavLink = NavLinkDefault,
  Outlet = OutletDefault,
  navigate = navigateFnDefault,
  location = window.location,
  useSearchParams = useSearchParamsDefault,
  useMatches = useMatchesDefault
}: {
  children: ReactNode
} & Partial<RouterContextType>) => {
  return (
    <RouterContext.Provider
      value={{
        Link,
        NavLink,
        Outlet,
        navigate,
        location,
        useSearchParams,
        useMatches
      }}
    >
      {children}
    </RouterContext.Provider>
  )
}
