import { ComponentPropsWithoutRef, ElementRef, forwardRef, useCallback, useMemo, useRef, useState } from 'react'

import { cn } from '@/utils/cn'
import * as SliderPrimitive from '@radix-ui/react-slider'

import { Label } from './form-primitives/label'

export interface SliderProps extends Omit<ComponentPropsWithoutRef<typeof SliderPrimitive.Root>, 'orientation'> {
  label?: string
  caption?: 'description' | 'min-max'
  description?: string
  minLabel?: string
  maxLabel?: string
  showValue?: boolean
  formatValue?: (value: number[]) => string
  className?: string
}

const defaultFormatValue = (values: number[]): string => {
  if (values.length === 1) return String(values[0])
  if (values.length === 2) return `${values[0]} – ${values[1]}`
  return values.join(', ')
}

const Slider = forwardRef<ElementRef<typeof SliderPrimitive.Root>, SliderProps>(
  (
    {
      className,
      label,
      caption = 'description',
      description,
      minLabel = '0',
      maxLabel = '100',
      showValue = false,
      formatValue = defaultFormatValue,
      defaultValue,
      value,
      onValueChange,
      ...props
    },
    ref
  ) => {
    const id = useMemo(() => `slider-${Math.random().toString(36).slice(2, 11)}`, [])
    const [internalValue, setInternalValue] = useState(defaultValue ?? [0])
    const currentValue = value ?? internalValue
    const draggingThumbs = useRef(new Set<number>())
    const hoveredThumbs = useRef(new Set<number>())
    const [, forceRender] = useState(false)

    const isThumbActive = useCallback(
      (index: number) => draggingThumbs.current.has(index) || hoveredThumbs.current.has(index),
      []
    )

    const handleValueChange = useCallback(
      (newValue: number[]) => {
        if (value === undefined) setInternalValue(newValue)
        onValueChange?.(newValue)
      },
      [onValueChange, value]
    )

    return (
      <div
        className={cn('cn-slider', props.disabled && 'cn-slider-disabled', className)}
        data-disabled={props.disabled || undefined}
      >
        {label && <Label htmlFor={id}>{label}</Label>}

        <div className="cn-slider-body">
          <SliderPrimitive.Root
            ref={ref}
            id={id}
            className="cn-slider-root"
            {...(value !== undefined ? { value } : { defaultValue })}
            onValueChange={handleValueChange}
            {...props}
            minStepsBetweenThumbs={currentValue.length > 1 ? 1 : undefined}
          >
            <SliderPrimitive.Track className="cn-slider-track">
              <SliderPrimitive.Range className="cn-slider-range" />
            </SliderPrimitive.Track>
            {currentValue.map((val, i) => (
              <SliderPrimitive.Thumb
                key={i}
                className="cn-slider-thumb"
                aria-label={currentValue.length > 1 ? (i === 0 ? 'Minimum value' : 'Maximum value') : undefined}
                onPointerDown={() => {
                  draggingThumbs.current.add(i)
                  forceRender(n => !n)
                }}
                onPointerUp={() => {
                  draggingThumbs.current.delete(i)
                  forceRender(n => !n)
                }}
                onMouseEnter={() => {
                  hoveredThumbs.current.add(i)
                  forceRender(n => !n)
                }}
                onMouseLeave={() => {
                  hoveredThumbs.current.delete(i)
                  draggingThumbs.current.delete(i)
                  forceRender(n => !n)
                }}
              >
                {isThumbActive(i) && <span className="cn-slider-tooltip">{formatValue([val])}</span>}
              </SliderPrimitive.Thumb>
            ))}
          </SliderPrimitive.Root>

          {showValue && caption !== 'min-max' && (
            <span className={cn('cn-slider-value-text', currentValue.length > 1 && 'cn-slider-value-text-range')}>
              {formatValue(currentValue)}
            </span>
          )}
        </div>

        {caption === 'description' && description && <p className="cn-slider-description">{description}</p>}

        {caption === 'min-max' && (
          <div className="cn-slider-minmax">
            <span>{minLabel}</span>
            <span>{maxLabel}</span>
          </div>
        )}
      </div>
    )
  }
)
Slider.displayName = 'Slider'

// --- Severity Slider ---

export interface SeveritySliderProps {
  min?: number
  max?: number
  step?: number
  value?: [number, number]
  defaultValue?: [number, number]
  onValueChange?: (value: [number, number]) => void
  onValueCommit?: (value: [number, number]) => void
  disabled?: boolean
  label?: string
  labels?: string[]
  className?: string
}

const SeveritySlider = forwardRef<ElementRef<typeof SliderPrimitive.Root>, SeveritySliderProps>(
  (
    {
      className,
      min = 0,
      max = 100,
      step = 1,
      value,
      defaultValue = [20, 70],
      onValueChange,
      onValueCommit,
      disabled = false,
      label,
      labels = ['Low', 'Medium', 'High', 'Critical']
    },
    ref
  ) => {
    const id = useMemo(() => `severity-slider-${Math.random().toString(36).slice(2, 11)}`, [])
    const [internalValue, setInternalValue] = useState<[number, number]>(defaultValue)
    const currentValue = value ?? internalValue

    const handleValueChange = useCallback(
      (newValue: number[]) => {
        if (newValue.length >= 2) {
          const next: [number, number] = [newValue[0], newValue[1]]
          if (value === undefined) setInternalValue(next)
          onValueChange?.(next)
        }
      },
      [onValueChange, value]
    )

    const handleValueCommit = useCallback(
      (newValue: number[]) => {
        if (newValue.length >= 2) {
          onValueCommit?.([newValue[0], newValue[1]])
        }
      },
      [onValueCommit]
    )

    return (
      <div className={cn('cn-slider-severity', className)} data-disabled={disabled || undefined}>
        {label && <Label htmlFor={id}>{label}</Label>}

        <div className="cn-slider-severity-body">
          <SliderPrimitive.Root
            ref={ref}
            id={id}
            className="cn-slider-severity-root"
            min={min}
            max={max}
            step={step}
            {...(value !== undefined ? { value } : { defaultValue })}
            onValueChange={handleValueChange}
            onValueCommit={handleValueCommit}
            disabled={disabled}
            minStepsBetweenThumbs={Math.max(1, Math.ceil(((max - min) * 0.05) / step))}
          >
            <SliderPrimitive.Track className="cn-slider-severity-track">
              <SliderPrimitive.Range className="cn-slider-severity-range" />
            </SliderPrimitive.Track>

            <SliderPrimitive.Thumb className="cn-slider-severity-thumb" aria-label="Minimum value" />
            <SliderPrimitive.Thumb className="cn-slider-severity-thumb" aria-label="Maximum value" />
          </SliderPrimitive.Root>
        </div>

        {labels.length > 0 && (
          <div className="cn-slider-severity-labels">
            {labels.map((text, i) => (
              <span key={i}>{text}</span>
            ))}
          </div>
        )}
      </div>
    )
  }
)
SeveritySlider.displayName = 'SeveritySlider'

export { Slider, SeveritySlider }
