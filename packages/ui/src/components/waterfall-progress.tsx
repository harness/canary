import { forwardRef, useMemo, type HTMLAttributes, type ReactNode } from 'react'

import { clamp, cn } from '@/utils'
import { motion } from 'framer-motion'

import { Popover } from './popover'
import { Text } from './text'

type WaterfallTheme = 'muted' | 'info' | 'danger' | 'success' | 'warning'

export interface WaterfallProgressProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  value: number
  startOffset?: number
  inProgress?: boolean
  className?: string
  theme?: WaterfallTheme
  label?: string
  tooltipContent?: ReactNode
  tooltipProps?: Partial<React.ComponentProps<typeof Popover>>
}

const THEME_TO_BG: Record<WaterfallTheme, string> = {
  muted: 'bg-cn-gray-primary',
  info: 'bg-cn-brand-primary',
  success: 'bg-cn-success-primary',
  warning: 'bg-cn-warning-primary',
  danger: 'bg-cn-danger-primary'
}

export const WaterfallProgress = forwardRef<HTMLDivElement, WaterfallProgressProps>(
  (
    {
      value,
      startOffset = 0,
      inProgress = false,
      className = '',
      theme = 'muted',
      label = '',
      tooltipContent,
      tooltipProps,
      ...rest
    },
    ref
  ) => {
    const { leftPct, widthPct, ariaNow } = useMemo(() => {
      const safeStart = clamp(Number.isFinite(startOffset) ? startOffset : 0, 0, 100)
      const rawEnd = (Number.isFinite(startOffset) ? startOffset : 0) + (Number.isFinite(value) ? value : 0)
      const safeEnd = clamp(rawEnd, 0, 100)
      const width = Math.max(safeEnd - safeStart, 0)
      return {
        leftPct: `${safeStart}%`,
        widthPct: `${width}%`,
        ariaNow: safeEnd
      }
    }, [startOffset, value])

    const track = (
      <div
        className={cn('relative w-full overflow-hidden rounded-cn-full bg-cn-gray-secondary', 'h-cn-3xs', className)}
        ref={ref}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={ariaNow}
        {...rest}
      >
        {/* Progress fill */}
        <div
          className={cn(
            'absolute top-0 bottom-0 rounded-cn-full overflow-hidden',
            'transition-all duration-300 ease-out',
            THEME_TO_BG[theme]
          )}
          style={{ left: leftPct, width: widthPct }}
        >
          {inProgress && widthPct !== '0%' && (
            <motion.div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-25"
              initial={{ backgroundPosition: '0% 0%' }}
              animate={{ backgroundPosition: '200% 0%' }}
              transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.6, ease: 'linear' }}
              style={{
                backgroundImage:
                  'linear-gradient(135deg, transparent 25%, rgba(255,255,255,0.35) 50%, transparent 75%)',
                backgroundSize: '200% 100%'
              }}
            />
          )}
        </div>
      </div>
    )

    const content = tooltipContent ? (
      <Popover triggerType="hover" hoverDelay={200} closeDelay={300} content={tooltipContent} {...tooltipProps}>
        {track}
      </Popover>
    ) : (
      track
    )

    return (
      <div className="grid gap-cn-2xs">
        {label ? (
          <Text as="label" variant="body-strong" color="foreground-1">
            {label}
          </Text>
        ) : null}
        {content}
      </div>
    )
  }
)
WaterfallProgress.displayName = 'WaterfallProgress'
