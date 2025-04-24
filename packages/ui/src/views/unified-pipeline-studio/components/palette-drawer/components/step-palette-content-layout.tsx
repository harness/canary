import { forwardRef } from 'react'

import { cn } from '@utils/cn'

const StepsPaletteContentLayout = {
  Root: function Content({ children, className }: { children: React.ReactNode; className?: string }) {
    return <div className={cn('flex grow flex-col overflow-auto p-6 gap-y-6', className)}>{children}</div>
  },

  Section: forwardRef<HTMLDivElement, { children: React.ReactNode }>(function Section({ children }, ref) {
    return (
      <div ref={ref} className="flex flex-col">
        {children}
      </div>
    )
  }),

  SectionHeader: function SectionHeader({ children }: { children: React.ReactNode }) {
    return <div className="mb-3 flex flex-row justify-between text-cn-foreground-1">{children}</div>
  },

  SectionItem: function SectionHeader({ children }: { children: React.ReactNode }) {
    return <div className="mb-2.5 flex flex-col rounded-md border hover:!bg-cn-background-hover">{children}</div>
  }
}

export { StepsPaletteContentLayout }
