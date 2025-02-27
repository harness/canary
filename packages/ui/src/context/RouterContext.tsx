import { Component, ComponentType, createContext, ReactNode, useContext } from 'react'
import type { LinkProps, NavLinkProps } from 'react-router-dom'

// verify if final bundle doesn't have reference to react-router-dom

const DefaultOutlet = () => null

type OutletComponentType = ComponentType | null

interface RouterContextType {
  Link: ComponentType<LinkProps>
  NavLink: ComponentType<NavLinkProps>
  Outlet: OutletComponentType
}

const RouterContext = createContext<RouterContextType>({
  Link: Component,
  NavLink: Component,
  Outlet: DefaultOutlet // Use a placeholder in v5
})

export const useRouterContext = () => useContext(RouterContext)

const LinkDefault = ({ to, children, ...props }: LinkProps) => {
  return (
    <a href={to.toString()} {...props}>
      {children}
    </a>
  )
}

const NavLinkDefault = ({ to, children, className, style, ...props }: NavLinkProps) => {
  // Determine active state based on window location
  const isActive = window.location.pathname === to.toString()

  const finalClassName =
    typeof className === 'function'
      ? className({ isActive, isPending: false, isTransitioning: false }) // Mimic React Router v6 behavior
      : isActive
        ? `${className || ''} active`.trim()
        : className

  const finalStyle = typeof style === 'function' ? style({ isActive, isPending: false, isTransitioning: false }) : style

  return (
    <a href={to.toString()} className={finalClassName} style={finalStyle} {...props}>
      {children}
    </a>
  )
}

// Context provider
export const RouterProvider = ({
  children,
  Link = LinkDefault,
  NavLink = NavLinkDefault,
  Outlet = DefaultOutlet // Default to null for React Router v5
}: {
  children: ReactNode
  Link?: ComponentType<LinkProps>
  NavLink?: ComponentType<NavLinkProps>
  Outlet?: OutletComponentType
}) => {
  return <RouterContext.Provider value={{ Link, NavLink, Outlet }}>{children}</RouterContext.Provider>
}
