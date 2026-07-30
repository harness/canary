import { forwardRef, HTMLAttributes, ReactNode } from 'react'

import { cn } from '@utils/cn'
import { clamp } from '@utils/utils'
import { cva, type VariantProps } from 'class-variance-authority'

import { Text, type TextProps } from './text'

export type GaugeValueFormat = 'percent' | 'fraction' | 'score'
export type GaugeStatusLevel = 'poor' | 'fair' | 'good' | 'none'
export type GaugeStatus = 'auto' | GaugeStatusLevel

export interface GaugeThresholds {
  poor: number
  fair: number
}

export interface GaugeStatusLabelMap {
  poor: string
  fair: string
  good: string
}

export type GaugeSize = '3xs' | '2xs' | 'xs' | 'sm' | 'md' | 'lg'

export interface GaugeProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  value: number
  max?: number
  size?: GaugeSize
  label?: string
  showLabel?: boolean
  showValue?: boolean
  valueFormat?: GaugeValueFormat
  precision?: number
  status?: GaugeStatus
  thresholds?: GaugeThresholds
  statusLabelMap?: GaugeStatusLabelMap
  /**
   * Content below the gauge ring. Pass any ReactNode (text, popover trigger, etc.).
   * Falls back to the derived status label when omitted. Pass `null` to hide.
   */
  description?: ReactNode
}

const DEFAULT_MAX = 100
const DEFAULT_THRESHOLDS: GaugeThresholds = { poor: 33, fair: 66 }
const DEFAULT_STATUS_LABELS: GaugeStatusLabelMap = { poor: 'Poor', fair: 'Fair', good: 'Good' }

const gaugeVariants = cva('cn-gauge', {
  variants: {
    size: {
      '3xs': 'cn-gauge-size-3xs',
      '2xs': 'cn-gauge-size-2xs',
      xs: 'cn-gauge-size-xs',
      sm: 'cn-gauge-size-sm',
      md: 'cn-gauge-size-md',
      lg: 'cn-gauge-size-lg'
    },
    statusLevel: {
      poor: 'cn-gauge-status-poor',
      fair: 'cn-gauge-status-fair',
      good: 'cn-gauge-status-good',
      none: 'cn-gauge-status-none'
    }
  },
  defaultVariants: {
    size: 'md',
    statusLevel: 'none'
  }
})

type GaugeVariantProps = VariantProps<typeof gaugeVariants>

function clampValue(value: number, max: number): number {
  if (!Number.isFinite(value) || !Number.isFinite(max) || max < 0) return 0
  return clamp(value, 0, max)
}

function formatNumber(value: number, precision?: number): string {
  if (precision === undefined) {
    return Number.isInteger(value) ? String(value) : String(Number(value.toFixed(1)))
  }

  return value.toFixed(precision)
}

export function formatGaugeValue(
  value: number,
  max: number,
  valueFormat: GaugeValueFormat = 'percent',
  precision?: number
): string {
  const fraction = max === 0 ? 0 : value / max

  switch (valueFormat) {
    case 'fraction':
      return `${formatNumber(value, precision)} / ${formatNumber(max, precision)}`
    case 'score':
      return formatNumber(value, precision)
    case 'percent':
    default:
      return `${formatNumber(fraction * 100, precision)}%`
  }
}

export function deriveGaugeStatusLevel(
  percent: number,
  status: GaugeStatus = 'auto',
  thresholds: GaugeThresholds = DEFAULT_THRESHOLDS
): GaugeStatusLevel {
  if (status !== 'auto') return status
  if (percent <= thresholds.poor) return 'poor'
  if (percent <= thresholds.fair) return 'fair'
  return 'good'
}

export function getGaugeDescriptor(
  statusLevel: GaugeStatusLevel,
  statusLabelMap: GaugeStatusLabelMap = DEFAULT_STATUS_LABELS
): string | undefined {
  if (statusLevel === 'none') return undefined
  return statusLabelMap[statusLevel]
}

function getDescriptorStatusColor(statusLevel: GaugeStatusLevel): NonNullable<TextProps['color']> {
  switch (statusLevel) {
    case 'poor':
      return 'danger'
    case 'fair':
      return 'warning'
    case 'good':
      return 'success'
    case 'none':
      return 'brand'
  }
}

function renderDescription(
  description: ReactNode | undefined,
  statusLevel: GaugeStatusLevel,
  statusLabelMap: GaugeStatusLabelMap
): ReactNode {
  if (description === null) return null

  const content = description !== undefined ? description : getGaugeDescriptor(statusLevel, statusLabelMap)

  if (content == null || content === false) return null

  if (typeof content === 'string' || typeof content === 'number') {
    return (
      <Text
        className="cn-gauge-descriptor"
        variant="caption-normal"
        color={getDescriptorStatusColor(statusLevel)}
        align="center"
      >
        {content}
      </Text>
    )
  }

  return content
}

interface GaugeRingProps {
  readonly fraction: number
  readonly statusLevel: GaugeStatusLevel
}

const GAUGE_VIEWBOX_SIZE = 100
/** Stroke width in viewBox units; scales with CSS size automatically. */
const GAUGE_TRACK_WIDTH = 14

function GaugeRing({ fraction, statusLevel }: GaugeRingProps) {
  const radius = (GAUGE_VIEWBOX_SIZE - GAUGE_TRACK_WIDTH) / 2
  const circumference = 2 * Math.PI * radius
  const dashOffset = circumference * (1 - fraction)

  return (
    <svg className="cn-gauge-svg" viewBox={`0 0 ${GAUGE_VIEWBOX_SIZE} ${GAUGE_VIEWBOX_SIZE}`} aria-hidden="true">
      <circle
        className="cn-gauge-track"
        cx={GAUGE_VIEWBOX_SIZE / 2}
        cy={GAUGE_VIEWBOX_SIZE / 2}
        r={radius}
        fill="none"
        strokeWidth={GAUGE_TRACK_WIDTH}
      />
      <circle
        className={cn('cn-gauge-indicator', `cn-gauge-indicator-${statusLevel}`)}
        cx={GAUGE_VIEWBOX_SIZE / 2}
        cy={GAUGE_VIEWBOX_SIZE / 2}
        r={radius}
        fill="none"
        strokeWidth={GAUGE_TRACK_WIDTH}
        strokeDasharray={circumference}
        strokeDashoffset={dashOffset}
        transform={`rotate(-90 ${GAUGE_VIEWBOX_SIZE / 2} ${GAUGE_VIEWBOX_SIZE / 2})`}
      />
    </svg>
  )
}

const Gauge = forwardRef<HTMLDivElement, GaugeProps>(
  (
    {
      value,
      max = DEFAULT_MAX,
      size,
      label,
      showLabel = true,
      showValue = true,
      valueFormat = 'percent',
      precision,
      status = 'auto',
      thresholds = DEFAULT_THRESHOLDS,
      statusLabelMap = DEFAULT_STATUS_LABELS,
      className,
      description,
      'aria-label': ariaLabel,
      ...divProps
    },
    ref
  ) => {
    const safeMax = Number.isFinite(max) && max >= 0 ? max : DEFAULT_MAX
    const clampedValue = clampValue(value, safeMax)
    const fraction = safeMax === 0 ? 0 : clampedValue / safeMax
    const percent = fraction * 100
    const statusLevel = deriveGaugeStatusLevel(percent, status, thresholds)
    const formattedValue = formatGaugeValue(clampedValue, safeMax, valueFormat, precision)

    const resolvedSize: GaugeVariantProps['size'] = size ?? 'md'
    const showGaugeLabel = showLabel && Boolean(label)
    const descriptionContent = renderDescription(description, statusLevel, statusLabelMap)

    let valueVariant: 'heading-section' | 'heading-base' | 'heading-subsection' = 'heading-subsection'
    if (resolvedSize === 'lg') {
      valueVariant = 'heading-section'
    } else if (valueFormat === 'fraction') {
      valueVariant = 'heading-base'
    }

    return (
      <div
        {...divProps}
        ref={ref}
        role="meter"
        aria-valuenow={clampedValue}
        aria-valuemin={0}
        aria-valuemax={safeMax}
        aria-label={ariaLabel ?? label}
        className={cn(
          gaugeVariants({
            size: resolvedSize,
            statusLevel
          }),
          className
        )}
      >
        {showGaugeLabel && (
          <Text className="cn-gauge-label" variant="caption-normal" color="foreground-3" align="center">
            {label}
          </Text>
        )}

        <div className="cn-gauge-body">
          <div className="cn-gauge-ring">
            <GaugeRing fraction={fraction} statusLevel={statusLevel} />
            {showValue && (
              <Text className="cn-gauge-value" variant={valueVariant} color="foreground-2" align="center">
                {formattedValue}
              </Text>
            )}
          </div>
          {descriptionContent}
        </div>
      </div>
    )
  }
)

Gauge.displayName = 'Gauge'

export { Gauge, DEFAULT_STATUS_LABELS, DEFAULT_THRESHOLDS }
