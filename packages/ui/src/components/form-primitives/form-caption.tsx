import { PropsWithChildren } from 'react'

import { Icon } from '@components/icon'
import { cn } from '@utils/cn'
import { cva, VariantProps } from 'class-variance-authority'

const formCaptionVariants = cva('cn-caption', {
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

type FormCaptionProps = {
  theme?: VariantProps<typeof formCaptionVariants>['theme']
  className?: string
  disabled?: boolean
}

export const FormCaption = ({
  theme = 'default',
  className,
  disabled,
  children
}: PropsWithChildren<FormCaptionProps>) => {
  /**
   * Return null if no message, errorMessage, or warningMessage is provided
   */
  if (!children) {
    return null
  }

  const canShowIcon = theme === 'danger' || theme === 'warning'

  /**
   * cross-circle - danger
   * triangle-warning - warning
   */
  const effectiveIconName = theme === 'danger' ? 'cross-circle' : 'warning-triangle-outline'

  return (
    <p className={cn(formCaptionVariants({ theme }), { 'cn-caption-disabled': disabled }, className)}>
      {canShowIcon && <Icon name={effectiveIconName} size={14} />}
      <span>{children}</span>
    </p>
  )
}

FormCaption.displayName = 'FormCaption'
