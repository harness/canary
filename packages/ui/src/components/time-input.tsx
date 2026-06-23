import { forwardRef, useMemo } from 'react'

import { CommonInputsProp, ControlGroup, FormCaption, IconPropsV2, IconV2, Label } from '@/components'
import { cn } from '@utils/cn'

import { BaseInput, InputProps } from './inputs/base-input'

export interface TimeInputProps extends CommonInputsProp, Omit<InputProps, 'type'> {
  /** Leading icon name. Defaults to 'clock'. Pass undefined to hide. */
  icon?: IconPropsV2['name']
}

const TimeInput = forwardRef<HTMLInputElement, TimeInputProps>((props, ref) => {
  const {
    icon = 'clock',
    label,
    caption,
    error,
    warning,
    optional,
    wrapperClassName,
    disabled,
    orientation,
    tooltipProps,
    tooltipContent,
    labelSuffix,
    className,
    theme,
    ...restProps
  } = props

  const isHorizontal = orientation === 'horizontal'
  const effectiveTheme = error ? 'danger' : warning ? 'warning' : theme
  const inputId = useMemo(() => props.id || `input-${Math.random().toString(36).substring(2, 9)}`, [props.id])

  const inputEl = (
    <BaseInput
      type="time"
      id={inputId}
      disabled={disabled}
      theme={effectiveTheme}
      className={cn('cn-time-input', { 'pl-cn-2xl': !!icon }, className)}
      ref={ref}
      {...restProps}
    />
  )

  return (
    <ControlGroup.Root className={wrapperClassName} orientation={orientation}>
      {(!!label || (isHorizontal && !!caption)) && (
        <ControlGroup.LabelWrapper>
          {!!label && (
            <Label
              disabled={disabled}
              optional={optional}
              htmlFor={inputId}
              suffix={labelSuffix}
              tooltipProps={tooltipProps}
              tooltipContent={tooltipContent}
            >
              {label}
            </Label>
          )}
          {isHorizontal && !!caption && <FormCaption disabled={disabled}>{caption}</FormCaption>}
        </ControlGroup.LabelWrapper>
      )}
      <ControlGroup.InputWrapper>
        {icon ? (
          <span className="relative">
            <IconV2
              className="left-cn-sm text-cn-3 pointer-events-none absolute top-1/2 z-[1] -translate-y-1/2"
              name={icon}
              size="xs"
            />
            {inputEl}
          </span>
        ) : (
          inputEl
        )}

        {error ? (
          <FormCaption disabled={disabled} theme="danger">
            {error}
          </FormCaption>
        ) : warning ? (
          <FormCaption disabled={disabled} theme="warning">
            {warning}
          </FormCaption>
        ) : caption && !isHorizontal ? (
          <FormCaption disabled={disabled}>{caption}</FormCaption>
        ) : null}
      </ControlGroup.InputWrapper>
    </ControlGroup.Root>
  )
})

TimeInput.displayName = 'TimeInput'

export { TimeInput }
