import { ComponentType, createContext, CSSProperties, ReactNode, useContext } from 'react'

export interface LinkProps {
  to: string | { pathname: string }
  className?: string
  children?: ReactNode
  [key: string]: any
}

export interface NavLinkProps extends Omit<LinkProps, 'className'> {
  style?:
    | CSSProperties
    | ((props: { isActive: boolean; isPending: boolean; isTransitioning: boolean }) => CSSProperties)
  className?: string | ((props: { isActive: boolean; isPending: boolean; isTransitioning: boolean }) => string)
}

interface OutletProps {
  children?: ReactNode
}

type NavigateFunction = (to: string | number) => void

const resolveTo = (to: LinkProps['to']) => (typeof to === 'string' ? to : to.pathname || '/')

const LinkDefault = ({ to, children, className, ...props }: LinkProps) => {
  const href = resolveTo(to)
  return (
    <a href={href} className={className} {...props}>
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

interface RouterContextType {
  Link: ComponentType<LinkProps>
  NavLink: ComponentType<NavLinkProps>
  Outlet: ComponentType<OutletProps>
  navigate: NavigateFunction
  location: Location
}

const RouterContext = createContext<RouterContextType>({
  Link: LinkDefault,
  NavLink: NavLinkDefault,
  Outlet: OutletDefault,
  navigate: navigateFnDefault,
  location: window.location
})

export const useRouterContext = () => useContext(RouterContext)

export const RouterContextProvider = ({
  children,
  Link = LinkDefault,
  NavLink = NavLinkDefault,
  Outlet = OutletDefault,
  navigate = navigateFnDefault,
  location = window.location
}: {
  children: ReactNode
} & Partial<RouterContextType>) => {
  return (
    <RouterContext.Provider value={{ Link, NavLink, Outlet, navigate, location }}>{children}</RouterContext.Provider>
  )
}
