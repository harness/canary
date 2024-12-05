import { cn } from '@utils/cn'

interface FormSeparatorProps {
  dashed?: boolean
  dotted?: boolean
  className?: string
}

/**
 * A horizontal separator component for forms
 * @example
 * // Basic usage
 * <FormSeparator />
 *
 * // With dashed style
 * <FormSeparator dashed />
 *
 * // With custom className
 * <FormSeparator className="my-4" />
 */
export function FormSeparator({ dashed, dotted, className }: FormSeparatorProps) {
  return (
    <div
      className={cn('border-b', { 'border-dashed': dashed, 'border-dotted': dotted }, className)}
      role="separator"
      aria-orientation="horizontal"
    />
  )
}
