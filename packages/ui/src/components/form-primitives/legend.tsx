import { ReactNode } from 'react'

import { Text } from '@components/text'

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
 */
export function Legend({ title, description, className }: LegendProps) {
  return (
    <div className={className}>
      <Text size={3} weight={'medium'} as="p" role="heading">
        {title}
      </Text>
      {description && (
        <Text size={2} as="p" id="fieldset-description">
          {description}
        </Text>
      )}
    </div>
  )
}
