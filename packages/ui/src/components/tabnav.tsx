import { Slot } from '@radix-ui/react-slot'
import { cn } from '@utils/cn'

const TabNavRoot: React.FC = ({ children }) => {
  return (
    <div className="border-border-background text-muted-foreground inline-flex h-[44px] w-full items-center justify-start gap-6 border-b px-8">
      {children}
    </div>
  )
}

const commonClasses = 'flex h-full items-center text-center cursor-pointer'

const TabNavItem: React.FC = ({ children }) => {
  return (
    <Slot
      className={({ isActive }) => (isActive ? `${commonClasses} text-primary border-b border-primary` : commonClasses)}
    >
      {children}
    </Slot>
  )
}

export const TabNav = { Root: TabNavRoot, Item: TabNavItem }
