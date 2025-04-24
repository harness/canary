import { cn } from '@utils/cn'

const EntityFormLayout = {
  Root: function Root({ children }: { children: React.ReactNode }) {
    return <div className="flex h-full flex-col overflow-hidden">{children}</div>
  },

  Header: function Header({ children, withBorder = false }: { children: React.ReactNode; withBorder?: boolean }) {
    return <div className={cn('border-b px-6 py-5', withBorder && 'border-b border-cn-borders-3')}>{children}</div>
  },

  Title: function Title({ children }: { children: React.ReactNode }) {
    return <div className="mb-3 text-lg capitalize text-cn-foreground-1">{children}</div>
  },

  Description: function Title({ children }: { children: React.ReactNode }) {
    return <div className="my-3 text-cn-foreground-3">{children}</div>
  },

  Actions: function Title({ children }: { children: React.ReactNode }) {
    return <div className="my-3 flex gap-x-3">{children}</div>
  },

  Footer: function Footer({
    children,
    className,
    withBorder = false
  }: {
    children: React.ReactNode
    className?: string
    withBorder?: boolean
  }) {
    return (
      <div
        className={cn(
          'flex flex-row justify-between px-6 py-5',
          withBorder && 'border-t border-cn-borders-3',
          className
        )}
      >
        {children}
      </div>
    )
  }
}

export { EntityFormLayout }
