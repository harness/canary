import { FC, useMemo } from 'react'

import { cn } from '@/utils/cn'
import { Icon, IconNameMap } from '@components/icon'
import { Text } from '@components/text'
import { generateAlphaNumericHash } from '@utils/utils'
import { cva, type VariantProps } from 'class-variance-authority'

type IconName = keyof typeof IconNameMap

const progressVariants = cva('cn-progress', {
  variants: {
    size: {
      sm: 'cn-progress-sm',
      default: '',
      md: 'cn-progress-md'
    },
    state: {
      default: '',
      processing: 'cn-progress-processing',
      completed: 'cn-progress-completed',
      paused: 'cn-progress-paused',
      failed: 'cn-progress-failed'
    }
  },
  defaultVariants: {
    size: 'default',
    state: 'default'
  }
})

const getIconName = (state: VariantProps<typeof progressVariants>['state']): IconName => {
  if (state === 'completed') return 'tick-circle'
  if (state === 'paused') return 'circle-pause'
  if (state === 'failed') return 'cross-circle'
  return 'clock'
}

interface CommonProgressProps extends VariantProps<typeof progressVariants> {
  id?: string
  label?: string
  description?: string
  subtitle?: string
  showPercentage?: boolean
  showIcon?: boolean
  className?: string
}

interface DeterminateProgressProps extends CommonProgressProps {
  value: number
  variant?: 'default'
}

interface IndeterminateProgressProps extends CommonProgressProps {
  variant: 'indeterminate'
}

type ProgressProps = DeterminateProgressProps | IndeterminateProgressProps

const Progress: FC<ProgressProps> = ({
  id: defaultId,
  variant = 'default',
  state,
  size = 'default',
  showIcon = false,
  label,
  description,
  subtitle,
  showPercentage = false,
  className,
  ...rest
}) => {
  const value = variant === 'default' ? ((rest as DeterminateProgressProps).value ?? 0) : undefined

  const percentageValue = value && (value > 1 ? 100 : Math.round(value * 100))

  const id = useMemo(() => defaultId || `progress-${generateAlphaNumericHash(10)}`, [defaultId])

  const getIcon = () => {
    if (!showIcon) return null
    const iconName: IconName = getIconName(state)
    return <Icon className="cn-progress-icon" name={iconName} skipSize />
  }

  const getProgress = () => {
    if (variant === 'indeterminate') {
      return (
        <>
          <progress className="cn-progress-root" id={id} />
          <div className="cn-progress-overlay-box">
            <div className="cn-progress-overlay">
              <div className="cn-progress-indeterminate-fake" />
            </div>
          </div>
        </>
      )
    }
    return (
      <>
        <progress className="cn-progress-root" id={id} value={percentageValue} max={100} />

        {state === 'processing' && (
          <div className="cn-progress-overlay-box">
            <div className="cn-progress-overlay">
              <div
                className="cn-progress-processing-fake"
                style={{ transform: `translateX(-${100 - (percentageValue || 0)}%)` }}
              />
            </div>
          </div>
        )}
      </>
    )
  }

  return (
    <div className={cn(progressVariants({ size, state }), className)}>
      {(label || showPercentage || showIcon) && (
        <label className="cn-progress-header" htmlFor={id}>
          <div className="cn-progress-header-left">
            {label && (
              <Text variant="body-strong" color="foreground-1" truncate>
                {label}
              </Text>
            )}
          </div>
          <div className="cn-progress-header-right">
            {showPercentage && variant === 'default' && (
              <Text variant="body-strong" color="foreground-1">
                {percentageValue}%
              </Text>
            )}
            {getIcon()}
          </div>
        </label>
      )}

      <div className="cn-progress-container">{getProgress()}</div>

      {(description || subtitle) && (
        <div className="cn-progress-footer">
          <div className="cn-progress-description-wrap">
            {description && (
              <Text className="cn-progress-description" variant="body-strong" color="foreground-3" truncate>
                {description}
              </Text>
            )}
          </div>
          {subtitle && (
            <Text className="cn-progress-subtitle" align="right" variant="body-normal" color="foreground-3" truncate>
              {subtitle}
            </Text>
          )}
        </div>
      )}
    </div>
  )
}

Progress.displayName = 'Progress'

export { Progress }
