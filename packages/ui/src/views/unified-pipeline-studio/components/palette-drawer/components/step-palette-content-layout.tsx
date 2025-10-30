import { forwardRef } from 'react'

import { cn } from '@utils/cn'

const StepsPaletteContentLayout = {
  Root: function Content({ children, className }: { children: React.ReactNode; className?: string }) {
    return <div className={cn('flex grow flex-col overflow-auto px-cn-md', className)}>{children}</div>
  },

  Section: forwardRef<HTMLDivElement, { children: React.ReactNode }>(function Section({ children }, ref) {
    return (
      <div ref={ref} className="flex flex-col gap-cn-sm">
        {children}
      </div>
    )
  }),

  SectionHeader: function SectionHeader({ children }: { children: React.ReactNode }) {
    return <div className="flex flex-row justify-between text-cn-1">{children}</div>
  },

  SectionItem: function SectionHeader({ children }: { children: React.ReactNode }) {
    return <div className="flex flex-col rounded-cn-3 border hover:!bg-cn-hover">{children}</div>
  }
}

export { StepsPaletteContentLayout }
