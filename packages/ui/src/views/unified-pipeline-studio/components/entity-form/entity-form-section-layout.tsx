import { cn } from '@utils/cn'

const EntityFormSectionLayout = {
  Root: function Root({ children }: { children: React.ReactNode }) {
    return <div className="flex grow flex-col overflow-auto">{children}</div>
  },

  Header: function Header({
    children,
    className,
    withBorder = false
  }: {
    children: React.ReactNode
    className?: string
    withBorder?: boolean
  }) {
    return <div className={cn('px-6 py-5', withBorder && 'border-b border-cn-borders-3', className)}>{children}</div>
  },

  Title: function Title({ children, className }: { children: React.ReactNode; className?: string }) {
    return <div className={cn('text-xl text-cn-foreground-1 font-medium', className)}>{children}</div>
  },

  Description: function Description({ children }: { children: React.ReactNode }) {
    return <div className="mt-3 text-cn-foreground-3">{children}</div>
  },

  Form: function Form({ children, className }: { children: React.ReactNode; className?: string }) {
    return <div className={cn('flex flex-col grow px-6 py-5', className)}>{children}</div>
  }
}

export { EntityFormSectionLayout }
