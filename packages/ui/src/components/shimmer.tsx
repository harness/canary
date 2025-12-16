import { memo, useMemo, type CSSProperties, type ElementType } from 'react'

import { typographyVariantConfig } from '@components/text'
import { cn } from '@utils/cn'
import { cva, type VariantProps } from 'class-variance-authority'
import { motion } from 'framer-motion'

export const shimmerVariants = cva('cn-shimmer', {
  variants: {
    variant: typographyVariantConfig,
    color: {
      'foreground-1': '[--shimmer-color:var(--cn-text-1)]',
      'foreground-2': '[--shimmer-color:var(--cn-text-2)]',
      'foreground-3': '[--shimmer-color:var(--cn-text-3)]',
      'foreground-4': '[--shimmer-color:var(--cn-text-4)]',
      disabled: '[--shimmer-color:var(--cn-text-4)]',
      success: '[--shimmer-color:var(--cn-text-success)]',
      warning: '[--shimmer-color:var(--cn-text-warning)]',
      danger: '[--shimmer-color:var(--cn-text-danger)]',
      brand: '[--shimmer-color:var(--cn-text-brand)]',
      merged: '[--shimmer-color:var(--cn-text-merged)]'
    }
  },
  defaultVariants: {
    variant: 'body-normal',
    color: 'foreground-2'
  }
})

export type ShimmerProps = VariantProps<typeof shimmerVariants> & {
  children: string
  as?: ElementType
  className?: string
  duration?: number
  spread?: number
}

const ShimmerComponent = ({
  children,
  as: Component = 'p',
  className,
  duration = 2,
  spread = 2,
  color,
  variant
}: ShimmerProps) => {
  const MotionComponent = motion(Component as React.ElementType)

  const dynamicSpread = useMemo(() => (children?.length ?? 0) * spread, [children, spread])

  return (
    <MotionComponent
      animate={{ backgroundPosition: '0% center' }}
      className={cn(shimmerVariants({ color, variant }), className)}
      initial={{ backgroundPosition: '100% center' }}
      style={
        {
          '--shimmer-spread': `${dynamicSpread}px`
        } as CSSProperties
      }
      transition={{
        repeat: Number.POSITIVE_INFINITY,
        duration,
        ease: 'linear'
      }}
    >
      {children}
    </MotionComponent>
  )
}

export const Shimmer = memo(ShimmerComponent)
