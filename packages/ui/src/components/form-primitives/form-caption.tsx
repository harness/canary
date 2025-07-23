import { forwardRef, PropsWithChildren } from 'react'

import { IconV2 } from '@components/icon-v2'
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

export const FormCaption = forwardRef<HTMLParagraphElement, PropsWithChildren<FormCaptionProps>>(
  ({ theme = 'default', className, disabled, children, ...props }, ref) => {
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
    const effectiveIconName = theme === 'danger' ? 'xmark-circle' : 'warning-triangle'

    return (
      <p
        className={cn(formCaptionVariants({ theme }), { 'cn-caption-disabled': disabled }, className)}
        ref={ref}
        {...props}
      >
        {canShowIcon && <IconV2 name={effectiveIconName} size="md" />}
        <span>{children}</span>
      </p>
    )
  }
)

FormCaption.displayName = 'FormCaption'
