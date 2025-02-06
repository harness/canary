import { NavLink, NavLinkProps } from 'react-router-dom'

import { cn } from '@utils/cn'

const TabNavRoot: React.FC = ({ children }) => {
  return (
    <nav className="inline-flex h-[44px] w-full items-center justify-start gap-6 border-b border-border-background px-6 text-muted-foreground">
      {children}
    </nav>
  )
}

const commonClasses =
  'flex h-full items-center text-center cursor-pointer border-solid border-b-2 border-b-transparent px-0 font-normal text-foreground-2 duration-150 ease-in-out hover:text-foreground-1'

const TabNavItem: React.FC<NavLinkProps> = ({ children, ...props }) => {
  return (
    <NavLink
      role="tab"
      className={({ isActive }) =>
        cn(commonClasses, {
          'text-primary border-borders-9': isActive
        })
      }
      {...props}
    >
      {children}
    </NavLink>
  )
}

export const TabNav = { Root: TabNavRoot, Item: TabNavItem }
