import { cn } from '@utils/cn'

const StepsPaletteItemLayout = {
  Root: function Root({ children, ...rest }: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>) {
    return (
      <div className="px-cn-md py-cn-sm flex size-full cursor-pointer flex-row gap-3.5" {...rest}>
        {children}
      </div>
    )
  },
  Left: function Left({ children, className }: { children: React.ReactNode; className?: string }) {
    return <div className={cn('text-cn-1', className)}>{children}</div>
  },
  Right: function Right({ children }: { children: React.ReactNode }) {
    return <div className="flex grow flex-col">{children}</div>
  },
  Header: function Header({ children }: { children: React.ReactNode }) {
    return <div className="flex flex-row justify-between">{children}</div>
  },
  Title: function Title({ children, className }: { children: React.ReactNode; className?: string }) {
    return <div className={cn('font-medium leading-4', className)}>{children}</div>
  },
  Description: function Description({ children, className }: { children: React.ReactNode; className?: string }) {
    return <div className={cn('mt-cn-2xs line-clamp-2 overflow-hidden text-2 leading-4', className)}>{children}</div>
  },
  BadgeWrapper: function BadgeWrapper({ children }: { children: React.ReactNode }) {
    return (
      <div className="p-cn-4xs self-start rounded-full bg-gradient-to-r from-[#B1CBFF] via-[#6D6B75] to-[#B1CBFF]">
        <div className="bg-cn-1 px-cn-xs rounded-full text-2">{children}</div>
      </div>
    )
  },
  RightItem: function RightItem({ children }: { children: React.ReactNode }) {
    return <div className="p-cn-4xs flex items-center">{children}</div>
  }
}

export { StepsPaletteItemLayout }
