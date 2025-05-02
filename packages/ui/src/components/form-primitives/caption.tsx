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
  message?: string
  errorMessage?: string
  warningMessage?: string
  className?: string
  showIcon?: boolean
}

export const Caption = ({
  theme = 'default',
  message,
  errorMessage,
  warningMessage,
  showIcon = true,
  className
}: CaptionProps) => {
  /**
   * Return null if no message, errorMessage, or warningMessage is provided
   */
  if (!message && !errorMessage && !warningMessage) {
    return null
  }

  /**
   * if theme is default, then message is the caption text
   * if theme is danger, then errorMessage is the caption text
   * if theme is warning, then warningMessage is the caption text
   */
  const effectiveMessageText =
    theme === 'default' || theme === 'success' ? message : theme === 'danger' ? errorMessage : warningMessage

  const canShowIcon = theme === 'default' || theme === 'success' ? false : showIcon

  /**
   * cross-circle - danger
   * triangle-warning - warning
   */
  const effectiveIconName =
    theme === 'danger' ? 'cross-circle' : theme === 'warning' ? 'warning-triangle-outline' : 'tick'

  return (
    <p role="region" aria-live="polite" className={cn(captionVariants({ theme }), className)}>
      {canShowIcon && <Icon name={effectiveIconName} size={14} />}
      <span>{effectiveMessageText}</span>
    </p>
  )
}

Caption.displayName = 'Caption'
