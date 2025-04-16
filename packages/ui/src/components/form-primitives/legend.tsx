import { PropsWithChildren, ReactNode } from 'react'

import { cn } from '@utils/cn'

interface LegendProps {
  title: ReactNode
  description?: ReactNode
  className?: string
}

/**
 * Legend component for form fieldsets
 *
 * @example
 * <Legend
 *   title="Personal Information"
 *   description="Please fill in your details below"
 * />
 *
 * <Legend title="Some Title" description="Some Description">
 *   <Button>Some Button</Button>
 * </Legend>
 */
export function Legend({ title, description, className, children }: PropsWithChildren<LegendProps>) {
  return (
    <section className={cn('grid gap-y-2.5', className)}>
      <h6 className="text-4 font-medium leading-tight text-cn-foreground-1">{title}</h6>

      {description && <p className="text-sm text-cn-foreground-2">{description}</p>}

      {children}
    </section>
  )
}
