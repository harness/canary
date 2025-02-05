import { NavLink, NavLinkProps } from 'react-router-dom'

const TabNavRoot: React.FC = ({ children }) => {
  return (
    <div className="inline-flex h-[44px] w-full items-center justify-start gap-6 border-b border-border-background px-8 text-muted-foreground">
      {children}
    </div>
  )
}

const commonClasses = 'flex h-full items-center text-center cursor-pointer'

const TabNavItem: React.FC<NavLinkProps> = ({ children, ...props }) => {
  return (
    <NavLink
      {...props}
      className={({ isActive }) => (isActive ? `${commonClasses} text-primary border-b border-primary` : commonClasses)}
    >
      {children}
    </NavLink>
  )
}

export const TabNav = { Root: TabNavRoot, Item: TabNavItem }
