const StepsPaletteContent = {
  Root: function Content({ children }: { children: React.ReactNode }) {
    return <div className="flex flex-col overflow-scroll">{children}</div>
  },

  Section: function Section({ children }: { children: React.ReactNode }) {
    return <div className="mx-4 flex flex-col pt-4">{children}</div>
  },

  SectionHeader: function SectionHeader({ children }: { children: React.ReactNode }) {
    return <div className="mb-3 flex flex-row justify-between text-accent-foreground">{children}</div>
  },

  SectionItem: function SectionHeader({ children }: { children: React.ReactNode }) {
    return (
      <div className="hover:bg-shade-10 mb-3 flex flex-col rounded-md border bg-gradient-to-br from-[#FFFFFF15] to-[#FFFFFF00] p-2">
        {children}
      </div>
    )
  }
}

export { StepsPaletteContent }
