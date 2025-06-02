import { PropsWithChildren, useMemo } from 'react'

import { Icon } from '@components/icon'
import { cn } from '@utils/cn'
import { cva, VariantProps } from 'class-variance-authority'
import { motion } from 'motion/react'

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
  const canShowIcon = theme === 'danger' || theme === 'warning'
  const effectiveIconName = theme === 'danger' ? 'cross-circle' : 'warning-triangle-outline'

  const captionId = useMemo(() => `caption-${Math.random().toString(36).substring(2, 9)}`, [])

  return children ? (
    <motion.p
      key={captionId}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.15, ease: 'easeInOut' }}
      className={cn(formCaptionVariants({ theme }), { 'cn-caption-disabled': disabled }, className)}
    >
      {canShowIcon && <Icon name={effectiveIconName} size={14} />}
      <span>{children}</span>
    </motion.p>
  ) : null
}

FormCaption.displayName = 'FormCaption'
