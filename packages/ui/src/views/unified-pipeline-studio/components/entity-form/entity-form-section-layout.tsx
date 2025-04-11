import { cn } from '@utils/cn'

const EntityFormSectionLayout = {
  Root: function Root({ children }: { children: React.ReactNode }) {
    return <div className="flex grow flex-col overflow-auto">{children}</div>
  },

  Header: function Header({ children, className }: { children: React.ReactNode; className?: string }) {
    return <div className={cn('p-4', className)}>{children}</div>
  },

  Title: function Title({ children, className }: { children: React.ReactNode; className?: string }) {
    return <div className={cn('my-3 text-lg text-cn-foreground-1', className)}>{children}</div>
  },

  Description: function Description({ children }: { children: React.ReactNode }) {
    return <div className="mt-3 text-cn-foreground-3">{children}</div>
  },

  Form: function Form({ children, className }: { children: React.ReactNode; className?: string }) {
    return <div className={cn('mb-5 p-5', className)}>{children}</div>
  }
}

export { EntityFormSectionLayout }
