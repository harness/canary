import { cx } from 'class-variance-authority'

const EntityFormSectionLayout = {
  Root: function Root({ children }: { children: React.ReactNode }) {
    return <div className="flex grow flex-col overflow-auto">{children}</div>
  },

  Header: function Header({ children }: { children: React.ReactNode }) {
    return <div className="p-4">{children}</div>
  },

  Title: function Title({ children }: { children: React.ReactNode }) {
    return <div className="my-3 text-lg text-accent-foreground">{children}</div>
  },

  Description: function Description({ children }: { children: React.ReactNode }) {
    return <div className="mt-3 text-muted-foreground">{children}</div>
  },

  Form: function Form({ children, className }: { children: React.ReactNode; className?: string }) {
    return <div className={cx('mb-5 p-5', className)}>{children}</div>
  }
}

export { EntityFormSectionLayout }
