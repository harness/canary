import { Component, ComponentType, createContext, ReactNode, useContext } from 'react'
import type { LinkProps as RouterLinkProps } from 'react-router-dom'

// verify if final bundle doesn't have reference to react-router-dom

const DefaultOutlet = () => null

export type LinkProps = RouterLinkProps
export type OutletComponentType = ComponentType | null

interface RouterContextType {
  Link: ComponentType<LinkProps>
  Outlet: OutletComponentType
}

const RouterContext = createContext<RouterContextType>({
  Link: Component,
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

// Context provider
export const RouterProvider = ({
  children,
  Link = LinkDefault,
  Outlet = DefaultOutlet // Default to null for React Router v5
}: {
  children: ReactNode
  Link?: ComponentType<LinkProps>
  Outlet?: OutletComponentType
}) => {
  return <RouterContext.Provider value={{ Link, Outlet }}>{children}</RouterContext.Provider>
}
