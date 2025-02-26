const StepsPaletteItemLayout = {
  Root: function Root({ children, ...rest }: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>) {
    return (
      <div className="flex size-full cursor-pointer flex-row gap-2" {...rest}>
        {children}
      </div>
    )
  },
  Left: function Left({ children }: { children: React.ReactNode }) {
    return <div className="text-accent-foreground">{children}</div>
  },
  Right: function Right({ children }: { children: React.ReactNode }) {
    return <div className="flex grow flex-col">{children}</div>
  },
  Header: function Header({ children }: { children: React.ReactNode }) {
    return <div className="flex flex-row justify-between">{children}</div>
  },
  Title: function Title({ children }: { children: React.ReactNode }) {
    return <div className="font-medium">{children}</div>
  },
  Description: function Description({ children }: { children: React.ReactNode }) {
    return <div className="mt-2 line-clamp-2 overflow-hidden text-sm text-muted-foreground">{children}</div>
  },
  BadgeWrapper: function BadgeWrapper({ children }: { children: React.ReactNode }) {
    return (
      <div className="self-start rounded-full bg-gradient-to-r from-[#B1CBFF] via-[#6D6B75] to-[#B1CBFF] p-0.5">
        <div className="rounded-full bg-background px-2 text-sm">{children}</div>
      </div>
    )
  }
}

export { StepsPaletteItemLayout }
