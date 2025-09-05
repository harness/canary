import { forwardRef, KeyboardEvent, useMemo, useRef } from 'react'

import { Button, CommonInputsProp, ControlGroup, FormCaption, IconV2, Label } from '@/components'

import { BaseInput, InputProps } from './base-input'

export interface NumberInputProps extends CommonInputsProp, Omit<InputProps, 'type'> {
  hideStepper?: boolean
  integerOnly?: boolean
}

/**
 * TODO: Design system: Add support for integer only
 *
 * Add support for:
 * - on paste handle integer only
 *
 * */

export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  (
    {
      wrapperClassName,
      label,
      id,
      disabled,
      optional,
      caption,
      error,
      warning,
      theme,
      hideStepper = false,
      integerOnly = false,
      suffix,
      orientation,
      labelSuffix,
      informerProps,
      informerContent,
      readOnly,
      ...props
    },
    ref
  ) => {
    const isHorizontal = orientation === 'horizontal'

    const isStepperDisabled = hideStepper || readOnly

    // Create a ref for internal focus management
    const inputRef = useRef<HTMLInputElement | null>(null)

    // override theme based on error and warning
    const effectiveTheme = error ? 'danger' : warning ? 'warning' : theme

    // Generate a unique ID if one isn't provided
    const inputId = useMemo(() => id || `input-${Math.random().toString(36).substring(2, 9)}`, [id])

    // Combine refs to handle both forward ref and internal ref
    const setRefs = (element: HTMLInputElement | null) => {
      // Save to local ref
      inputRef.current = element

      // Forward to external ref
      if (typeof ref === 'function') {
        ref(element)
      } else if (ref) {
        ref.current = element
      }
    }

    const handleIncrement = () => {
      if (isStepperDisabled) return

      const input = inputRef.current
      if (input) {
        input.stepUp()
        input.focus()
        /**
         * input.stepUp() will change the value of the input field, but it does not automatically trigger the onchange event callback.
         * React Hook Form wasn't detecting these changes because no onChange event was being triggered
         */
        const event = new Event('input', { bubbles: true })
        input.dispatchEvent(event)
      }
    }

    const handleDecrement = () => {
      if (isStepperDisabled) return

      const input = inputRef.current
      if (input) {
        input.stepDown()
        input.focus()
        /**
         * input.stepDown() will change the value of the input field, but it does not automatically trigger the onchange event callback.
         * React Hook Form wasn't detecting these changes because no onChange event was being triggered
         */
        const event = new Event('input', { bubbles: true })
        input.dispatchEvent(event)
      }
    }

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
                informerProps={informerProps}
                informerContent={informerContent}
              >
                {label}
              </Label>
            )}
            {isHorizontal && !!caption && <FormCaption disabled={disabled}>{caption}</FormCaption>}
          </ControlGroup.LabelWrapper>
        )}
        <ControlGroup.InputWrapper>
          <BaseInput
            type="number"
            ref={setRefs}
            id={inputId}
            disabled={disabled}
            readOnly={readOnly}
            inputMode={integerOnly ? 'numeric' : 'decimal'}
            theme={effectiveTheme}
            onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
              // Prevent decimal point input when integerOnly is true
              if (integerOnly && e.key === '.') {
                e.preventDefault()
              }
            }}
            suffix={
              (!isStepperDisabled || !!suffix) && (
                <div className="flex">
                  {!isStepperDisabled ? (
                    <div className="flex flex-col">
                      <Button
                        tabIndex={-1}
                        className="shrink"
                        aria-label="Increment value"
                        variant="ghost"
                        iconOnly
                        onClick={handleIncrement}
                        disabled={disabled}
                        size="sm"
                        ignoreIconOnlyTooltip
                      >
                        <IconV2 name="nav-arrow-up" size="xs" />
                      </Button>
                      <hr />
                      <Button
                        tabIndex={-1}
                        className="shrink"
                        aria-label="Decrement value"
                        variant="ghost"
                        iconOnly
                        onClick={handleDecrement}
                        disabled={disabled}
                        size="sm"
                        ignoreIconOnlyTooltip
                      >
                        <IconV2 name="nav-arrow-down" size="xs" />
                      </Button>
                    </div>
                  ) : null}
                  {suffix ? <div className={isStepperDisabled ? '' : 'border-inherit'}>{suffix}</div> : null}
                </div>
              )
            }
            {...props}
          />

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
  }
)

NumberInput.displayName = 'NumberInput'
