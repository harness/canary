import { forwardRef, useMemo } from 'react'

import { CommonInputsProp, ControlGroup, FormCaption, Label } from '@/components'

import { BaseInput, InputProps } from './base-input'

export interface TextInputProps extends CommonInputsProp, InputProps {
  type?: Exclude<HTMLInputElement['type'], 'number' | 'search' | 'hidden' | 'radio' | 'checkbox' | 'button'>
}

const TextInput = forwardRef<HTMLInputElement, TextInputProps>((props, ref) => {
  const {
    label,
    labelSuffix,
    optional,
    caption,
    error,
    warning,
    wrapperClassName,
    disabled,
    orientation,
    tooltipProps,
    tooltipContent,
    ...restProps
  } = props
  const isHorizontal = orientation === 'horizontal'

  // override theme based on error and warning
  const theme = error ? 'danger' : warning ? 'warning' : props.theme

  // Generate a unique ID if one isn't provided
  const inputId = useMemo(() => props.id || `input-${Math.random().toString(36).substring(2, 9)}`, [props.id])

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
        <BaseInput {...restProps} ref={ref} theme={theme} id={inputId} disabled={disabled} />

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

TextInput.displayName = 'TextInput'

export { TextInput }
