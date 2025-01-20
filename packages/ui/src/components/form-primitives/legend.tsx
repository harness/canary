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
      <Text size={13} weight="medium" as="h2">
        {title}
      </Text>
      {description && (
        <Text className="mt-2" size={2} as="p" id="fieldset-description" color="foreground-2">
          {description}
        </Text>
      )}
    </div>
  )
}
