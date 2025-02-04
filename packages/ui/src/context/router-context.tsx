import { ComponentType, createContext, ReactNode, useContext } from 'react'
import type { LinkProps, NavigateFunction, NavLinkProps, OutletProps } from 'react-router-dom'

import { cn } from '@utils/cn'

interface RouterContextType {
  Link: ComponentType<LinkProps>
  NavLink: ComponentType<NavLinkProps>
  Outlet: ComponentType<OutletProps>
  navigate: NavigateFunction
  location: Location
}

const resolveTo = (to: LinkProps['to']) => (typeof to === 'string' ? to : to.pathname || '/')

const LinkDefault = ({ to, children, className, ...props }: LinkProps) => {
  const href = resolveTo(to)
  return (
    <a href={href} className={cn('text-blue-500 hover:underline', className)} {...props}>
      {children}
    </a>
  )
}

const NavLinkDefault = ({ to, children, className, style, ...props }: NavLinkProps) => {
  const href = resolveTo(to)
  const isActive = new URL(href, window.location.origin).pathname === window.location.pathname

  const finalClassName =
    typeof className === 'function' ? className({ isActive, isPending: false, isTransitioning: false }) : cn(className)

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
