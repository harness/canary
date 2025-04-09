import { cx } from 'class-variance-authority'

const ConnectorsPaletteLayout = {
  Root: function Root({ children }: { children: React.ReactNode }) {
    return <div className="flex h-full flex-col overflow-hidden">{children}</div>
  },

  Header: function Header({ children, className }: { children: React.ReactNode; className?: string }) {
    return <div className={cx(`border-b p-4`, className)}>{children}</div>
  },

  Title: function Title({ children, className }: { children: React.ReactNode; className?: string }) {
    return <div className={cx('mb-3 text-lg text-cn-foreground-1', className)}>{children}</div>
  },

  Subtitle: function Subtitle({ children, className }: { children: React.ReactNode; className?: string }) {
    return <div className={cx('mb-2 text-md text-cn-foreground-1', className)}>{children}</div>
  }
}

export { ConnectorsPaletteLayout }
