import { forwardRef, KeyboardEvent, useMemo, useRef } from 'react'

import { Button, ControlGroup, FormCaption, Icon, Label } from '@/components'

import { BaseInput, InputProps } from './base-input'

export interface NumberInputProps extends Omit<InputProps, 'type' | 'suffix'> {
  wrapperClassName?: string
  caption?: string
  error?: string
  warning?: string
  optional?: boolean
  hideStepper?: boolean
  integerOnly?: boolean
}

function focusAtEnd(element: HTMLInputElement | null): void {
  if (element) {
    element.setSelectionRange(element.value.length, element.value.length)
  }
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
      ...props
    },
    ref
  ) => {
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
      inputRef.current?.stepUp()
      focusAtEnd(inputRef.current)
    }

    const handleDecrement = () => {
      inputRef.current?.stepDown()
      focusAtEnd(inputRef.current)
    }

    return (
      <ControlGroup className={wrapperClassName}>
        {!!label && (
          <Label disabled={disabled} optional={optional} htmlFor={id}>
            {label}
          </Label>
        )}

        <BaseInput
          type="number"
          ref={setRefs}
          id={inputId}
          disabled={disabled}
          inputMode={integerOnly ? 'numeric' : 'decimal'}
          theme={effectiveTheme}
          onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
            // Prevent decimal point input when integerOnly is true
            if (integerOnly && e.key === '.') {
              e.preventDefault()
            }
          }}
          suffix={
            hideStepper ? null : (
              <div className="flex flex-col">
                <Button
                  tabIndex={-1}
                  aria-label="Increment value"
                  variant="ghost"
                  iconOnly
                  onClick={handleIncrement}
                  disabled={disabled}
                  size="sm"
                >
                  <Icon name="chevron-up" size={14} />
                </Button>
                <hr />
                <Button
                  tabIndex={-1}
                  aria-label="Decrement value"
                  variant="ghost"
                  iconOnly
                  onClick={handleDecrement}
                  disabled={disabled}
                  size="sm"
                >
                  <Icon name="chevron-down" size={14} />
                </Button>
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
        ) : caption ? (
          <FormCaption disabled={disabled}>{caption}</FormCaption>
        ) : null}
      </ControlGroup>
    )
  }
)

NumberInput.displayName = 'NumberInput'
