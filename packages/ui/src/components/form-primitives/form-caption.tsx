import { forwardRef, PropsWithChildren } from 'react'

import { cn } from '@/utils'
import { IconV2 } from '@components/icon-v2'
import { Text, textVariants } from '@components/text'
import { VariantProps } from 'class-variance-authority'

type ThemeVariants = 'default' | 'success' | 'danger' | 'warning'
type TextColorVariants = VariantProps<typeof textVariants>['color']

type FormCaptionProps = {
  theme?: ThemeVariants
  className?: string
  disabled?: boolean
}

export const FormCaption = forwardRef<HTMLParagraphElement, PropsWithChildren<FormCaptionProps>>(
  ({ theme = 'default', className, disabled, children }, ref) => {
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

    const getColor = (theme: ThemeVariants, disabled?: boolean): TextColorVariants => {
      if (disabled) return 'disabled'
      const colorMap: Record<ThemeVariants, TextColorVariants> = {
        default: 'foreground-3',
        success: 'success',
        danger: 'danger',
        warning: 'warning'
      }
      return colorMap[theme]
    }

    return (
      <Text color={getColor(theme, disabled)} className={cn('cn-caption', className)} ref={ref}>
        {canShowIcon && <IconV2 name={effectiveIconName} size="md" />}
        <span>{children}</span>
      </Text>
    )
  }
)

FormCaption.displayName = 'FormCaption'
