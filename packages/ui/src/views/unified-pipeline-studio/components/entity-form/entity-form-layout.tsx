import { cn } from '@utils/cn'

const EntityFormLayout = {
  Root: function Root({ children }: { children: React.ReactNode }) {
    return <div className="flex h-full flex-col overflow-hidden">{children}</div>
  },

  Header: function Header({ children }: { children: React.ReactNode }) {
    return <div className={`border-b p-4`}>{children}</div>
  },

  Title: function Title({ children }: { children: React.ReactNode }) {
    return <div className="mb-3 text-lg capitalize text-cn-foreground-1">{children}</div>
  },

  Description: function Title({ children }: { children: React.ReactNode }) {
    return <div className="my-3 text-cn-foreground-3">{children}</div>
  },

  Actions: function Title({ children }: { children: React.ReactNode }) {
    return <div className="my-3">{children}</div>
  },

  Footer: function Footer({ children, className }: { children: React.ReactNode; className?: string }) {
    return <div className={cn('flex flex-row justify-between border-t p-4', className)}>{children}</div>
  }
}

export { EntityFormLayout }
