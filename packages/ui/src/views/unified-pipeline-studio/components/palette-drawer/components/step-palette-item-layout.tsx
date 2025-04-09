import { cn } from '@utils/cn'

const StepsPaletteItemLayout = {
  Root: function Root({ children, ...rest }: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>) {
    return (
      <div className="flex size-full cursor-pointer flex-row gap-2 p-2" {...rest}>
        {children}
      </div>
    )
  },
  Left: function Left({ children, className }: { children: React.ReactNode; className?: string }) {
    return <div className={cn('text-cn-foreground-1', className)}>{children}</div>
  },
  Right: function Right({ children }: { children: React.ReactNode }) {
    return <div className="flex grow flex-col">{children}</div>
  },
  Header: function Header({ children }: { children: React.ReactNode }) {
    return <div className="flex flex-row justify-between">{children}</div>
  },
  Title: function Title({ children, className }: { children: React.ReactNode; className?: string }) {
    return <div className={cn('font-medium', className)}>{children}</div>
  },
  Description: function Description({ children, className }: { children: React.ReactNode; className?: string }) {
    return <div className={cn('mt-1.5 line-clamp-2 overflow-hidden text-sm', className)}>{children}</div>
  },
  BadgeWrapper: function BadgeWrapper({ children }: { children: React.ReactNode }) {
    return (
      <div className="self-start rounded-full bg-gradient-to-r from-[#B1CBFF] via-[#6D6B75] to-[#B1CBFF] p-0.5">
        <div className="rounded-full bg-cn-background px-2 text-sm">{children}</div>
      </div>
    )
  },
  RightItem: function RightItem({ children }: { children: React.ReactNode }) {
    return <div className="flex items-center p-0.5">{children}</div>
  }
}

export { StepsPaletteItemLayout }
