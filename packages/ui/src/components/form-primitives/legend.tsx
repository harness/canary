import { ReactNode } from 'react'

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
      <p className="text-18 font-medium text-foreground-1">{title}</p>
      {description && (
        <p className="mt-2 text-14" id="fieldset-description">
          {description}
        </p>
      )}
    </div>
  )
}
