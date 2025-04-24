import { cx } from 'class-variance-authority'

const ConnectorsPaletteLayout = {
  Root: function Root({ children }: { children: React.ReactNode }) {
    return <div className="flex h-full flex-col">{children}</div>
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
    return <div className={cx('px-6 py-5', withBorder && 'border-b border-cn-borders-3', className)}>{children}</div>
  },

  Title: function Title({ children, className }: { children: React.ReactNode; className?: string }) {
    return <div className={cx('mb-6 text-xl text-cn-foreground-1 font-medium', className)}>{children}</div>
  },

  Subtitle: function Subtitle({ children, className }: { children: React.ReactNode; className?: string }) {
    return <div className={cx('mb-2 text-md text-cn-foreground-1', className)}>{children}</div>
  }
}

export { ConnectorsPaletteLayout }
