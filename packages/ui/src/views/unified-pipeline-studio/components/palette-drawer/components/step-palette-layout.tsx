const StepsPaletteLayout = {
  Root: function Root({ children }: { children: React.ReactNode }) {
    return <div className="flex h-full flex-col overflow-hidden">{children}</div>
  },

  Header: function Header({ children }: { children: React.ReactNode }) {
    return <div className={`border-b p-4`}>{children}</div>
  },

  Title: function Title({ children }: { children: React.ReactNode }) {
    return <div className="mb-3 text-lg text-cn-foreground-1">{children}</div>
  }
}

export { StepsPaletteLayout }
