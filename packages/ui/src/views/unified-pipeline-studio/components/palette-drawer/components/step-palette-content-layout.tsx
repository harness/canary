import { forwardRef } from 'react'

const StepsPaletteContentLayout = {
  Root: function Content({ children }: { children: React.ReactNode }) {
    return <div className="flex grow flex-col overflow-auto px-4">{children}</div>
  },

  Section: forwardRef<HTMLDivElement, { children: React.ReactNode }>(function Section({ children }, ref) {
    return (
      <div ref={ref} className="flex flex-col pt-4">
        {children}
      </div>
    )
  }),

  SectionHeader: function SectionHeader({ children }: { children: React.ReactNode }) {
    return <div className="mb-3 flex flex-row justify-between text-accent-foreground">{children}</div>
  },

  SectionItem: function SectionHeader({ children }: { children: React.ReactNode }) {
    return <div className="hover:bg-shade-10 mb-3 flex flex-col rounded-md border p-2">{children}</div>
  }
}

export { StepsPaletteContentLayout }
