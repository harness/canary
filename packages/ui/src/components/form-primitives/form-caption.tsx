import { PropsWithChildren } from 'react'

import { Icon } from '@components/icon'
import { cn } from '@utils/cn'
import { cva, VariantProps } from 'class-variance-authority'

const captionVariants = cva('cn-caption', {
  variants: {
    theme: {
      default: '',
      success: 'cn-caption-success',
      danger: 'cn-caption-danger',
      warning: 'cn-caption-warning'
    }
  },
  defaultVariants: {
    theme: 'default'
  }
})

// Default theme props
type CaptionProps = {
  theme?: VariantProps<typeof captionVariants>['theme']
  className?: string
  showIcon?: boolean
}

export const FormCaption = ({
  theme = 'default',
  showIcon = true,
  className,
  children
}: PropsWithChildren<CaptionProps>) => {
  /**
   * Return null if no message, errorMessage, or warningMessage is provided
   */
  if (!children) {
    return null
  }

  const canShowIcon = theme === 'danger' || theme === 'warning' ? showIcon : false

  /**
   * cross-circle - danger
   * triangle-warning - warning
   */
  const effectiveIconName =
    theme === 'danger' ? 'cross-circle' : theme === 'warning' ? 'warning-triangle-outline' : 'tick'

  return (
    <p role="region" aria-live="polite" className={cn(captionVariants({ theme }), className)}>
      {canShowIcon && <Icon name={effectiveIconName} size={14} />}
      <span>{children}</span>
    </p>
  )
}

FormCaption.displayName = 'FormCaption'
