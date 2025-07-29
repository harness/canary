import { FC, useMemo } from 'react'

import { cn } from '@/utils/cn'
import { Text } from '@components/text'
import { generateAlphaNumericHash } from '@utils/utils'
import { cva, type VariantProps } from 'class-variance-authority'

import { IconV2, type IconV2NamesType } from './icon-v2'

const progressVariants = cva('cn-progress', {
  variants: {
    size: {
      sm: 'cn-progress-sm',
      md: '',
      lg: 'cn-progress-lg'
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
    size: 'md',
    state: 'default'
  }
})

const getIconName = (state: VariantProps<typeof progressVariants>['state']): IconV2NamesType => {
  if (state === 'completed') return 'check-circle'
  if (state === 'paused') return 'pause'
  if (state === 'failed') return 'xmark-circle'
  return 'clock'
}

interface CommonProgressProps extends VariantProps<typeof progressVariants> {
  id?: string
  label?: string
  description?: string
  subtitle?: string
  className?: string
}
interface DeterminateProgressProps extends CommonProgressProps {
  value: number
  hidePercentage?: boolean
  hideIcon?: boolean
  variant?: 'default'
}
interface IndeterminateProgressProps extends CommonProgressProps {
  value?: never
  hidePercentage?: never
  hideIcon?: never
  variant: 'indeterminate'
}

type ProgressProps = DeterminateProgressProps | IndeterminateProgressProps

const Progress: FC<ProgressProps> = ({
  id: defaultId,
  variant = 'default',
  state,
  size = 'md',
  hideIcon = false,
  label,
  description,
  subtitle,
  hidePercentage = false,
  value = 0,
  className
}) => {
  const percentageValue = Math.min(Math.max(0, value), 1) * 100 || 0

  const id = useMemo(() => defaultId || `progress-${generateAlphaNumericHash(10)}`, [defaultId])

  const getIcon = () => {
    if (hideIcon || variant === 'indeterminate') return null
    const iconName: IconV2NamesType = getIconName(state)
    return <IconV2 className="cn-progress-icon" name={iconName} skipSize />
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
        <progress className="cn-progress-root" id={id} value={percentageValue} max={percentageValue} />

        {state === 'processing' && (
          <div className="cn-progress-overlay-box">
            <div className="cn-progress-overlay">
              <div
                className="cn-progress-processing-fake"
                style={{ transform: `translateX(-${100 - percentageValue}%)` }}
              />
            </div>
          </div>
        )}
      </>
    )
  }

  return (
    <div className={cn(progressVariants({ size, state }), className)}>
      {(label || !hidePercentage || !hideIcon) && (
        <label className="cn-progress-header" htmlFor={id}>
          <div className="cn-progress-header-left">
            {label && (
              <Text variant="body-strong" color="foreground-1" truncate>
                {label}
              </Text>
            )}
          </div>
          <div className="cn-progress-header-right">
            {!hidePercentage && variant === 'default' && (
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
