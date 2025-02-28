import { ComponentType, createContext, ReactNode, useContext } from 'react'

import { cn } from '@utils/cn'

interface RouterContextType {
  Link: ComponentType<LinkProps>
  NavLink: ComponentType<NavLinkProps>
  Outlet: ComponentType | null
  Switch: ComponentType | null
  navigate: (to: string, options?: { replace?: boolean }) => void
}

// Minimal LinkProps and NavLinkProps to avoid dependencies
interface LinkProps {
  to: string
  children: ReactNode
  className?: string
  style?: React.CSSProperties
}

interface NavLinkProps extends LinkProps {
  isActive?: boolean
}

const LinkDefault = ({ to, children, className, ...props }: LinkProps) => {
  return (
    <a href={to} className={cn('text-blue-500 hover:underline', className)} {...props}>
      {children}
    </a>
  )
}

const NavLinkDefault = ({ to, children, className, style, ...props }: NavLinkProps) => {
  const isActive = window.location.pathname === to

  return (
    <a
      href={to}
      className={cn(className, isActive ? 'font-bold text-blue-600' : 'text-blue-500')}
      style={style}
      {...props}
    >
      {children}
    </a>
  )
}

const OutletDefault = ({ children }: { children?: ReactNode }) => <>{children}</>

const SwitchDefault = ({ children }: { children?: ReactNode }) => <>{children}</>

const RouterContext = createContext<RouterContextType>({
  Link: LinkDefault,
  NavLink: NavLinkDefault,
  Outlet: OutletDefault,
  Switch: SwitchDefault,
  navigate: to => {
    window.location.href = to
  }
})

export const useRouterContext = () => useContext(RouterContext)

export const RouterProvider = ({
  children,
  Link = LinkDefault,
  NavLink = NavLinkDefault,
  Outlet = OutletDefault,
  Switch = SwitchDefault,
  navigate = to => {
    window.location.href = to
  }
}: {
  children: ReactNode
} & Partial<RouterContextType>) => {
  return <RouterContext.Provider value={{ Link, NavLink, Outlet, Switch, navigate }}>{children}</RouterContext.Provider>
}
