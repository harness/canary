import { cx } from 'class-variance-authority'

const EntityFormSectionLayout = {
  Root: function Root({ children }: { children: React.ReactNode }) {
    return <div className="flex grow flex-col overflow-auto">{children}</div>
  },

  Header: function Header({ children, className }: { children: React.ReactNode; className?: string }) {
    return <div className={cx('p-4', className)}>{children}</div>
  },

  Title: function Title({ children, className }: { children: React.ReactNode; className?: string }) {
    return <div className={cx('my-3 text-lg text-accent-foreground', className)}>{children}</div>
  },

  Description: function Description({ children }: { children: React.ReactNode }) {
    return <div className="mt-3 text-muted-foreground">{children}</div>
  },

  Form: function Form({ children, className }: { children: React.ReactNode; className?: string }) {
    return <div className={cx('mb-5 p-5', className)}>{children}</div>
  }
}

export { EntityFormSectionLayout }
