import { PropsWithChildren, ReactNode } from 'react'

import { Text } from '@components/text'
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
      <Text as="h6" className="text-4 font-medium leading-tight text-cn-1">
        {title}
      </Text>

      {description && <Text>{description}</Text>}

      {children}
    </section>
  )
}
