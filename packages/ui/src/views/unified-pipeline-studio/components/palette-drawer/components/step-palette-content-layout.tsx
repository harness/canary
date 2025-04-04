import { forwardRef } from 'react'

import { cn } from '@utils/cn'

const StepsPaletteContentLayout = {
  Root: function Content({ children, className }: { children: React.ReactNode; className?: string }) {
    return <div className={cn('flex grow flex-col overflow-auto px-4', className)}>{children}</div>
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
    return <div className="mb-3 flex flex-col rounded-md border hover:!bg-background-4">{children}</div>
  }
}

export { StepsPaletteContentLayout }
