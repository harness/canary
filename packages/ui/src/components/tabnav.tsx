import { NavLink, NavLinkProps } from 'react-router-dom'

// border-solid border-b-transparent px-0 font-normal text-foreground-2 duration-150 ease-in-out hover:text-foreground-1
const TabNavRoot: React.FC = ({ children }) => {
  return (
    <nav className="inline-flex h-[44px] w-full items-center justify-start gap-6 border-b border-border-background px-6 text-muted-foreground">
      {children}
    </nav>
  )
}

const commonClasses =
  'flex h-full items-center text-center cursor-pointer border-solid px-0 font-normal text-foreground-2 duration-150 ease-in-out hover:text-foreground-1'

const TabNavItem: React.FC<NavLinkProps> = ({ children, ...props }) => {
  return (
    <NavLink
      role="tab"
      className={({ isActive }) =>
        isActive ? `${commonClasses} text-primary border-b-2 border-borders-9` : commonClasses
      }
      {...props}
    >
      {children}
    </NavLink>
  )
}

export const TabNav = { Root: TabNavRoot, Item: TabNavItem }
