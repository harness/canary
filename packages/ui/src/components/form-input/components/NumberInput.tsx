import {
  ChangeEvent,
  FocusEvent,
  forwardRef,
  KeyboardEvent as ReactKeyboardEvent,
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react'

import { Button, Caption, ControlGroup, Label } from '@/components'
import { Icon } from '@components/icon'

import { BaseInput, InputProps } from './BaseInput'

export interface NumberInputProps extends Omit<InputProps, 'type' | 'prefix' | 'suffix' | 'onChange'> {
  stepper?: number
  defaultValue?: number
  min?: number
  max?: number
  value?: number // Controlled value
  onChange?: (value: number | undefined) => void
  decimalScale?: number
  allowNegative?: boolean
  allowDecimal?: boolean
  wrapperClassName?: string
  caption?: string
  error?: string
  warningMessage?: string
  optional?: boolean
  showStepper?: boolean
}

export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  (
    {
      stepper = 1,
      wrapperClassName,
      label,
      id,
      theme,
      disabled,
      optional,
      caption,
      error,
      placeholder,
      warningMessage,
      defaultValue,
      min = -Infinity,
      max = Infinity,
      onChange,
      decimalScale = 2,
      value: controlledValue,
      showStepper = true,
      allowDecimal = true,
      allowNegative = true,
      ...props
    },
    ref
  ) => {
    // Create a ref for internal focus management
    const inputRef = useRef<HTMLInputElement | null>(null)

    // Store current value as string to properly handle input
    const [value, setValue] = useState<string>(() => {
      const initialValue = controlledValue ?? defaultValue
      return initialValue !== undefined ? initialValue.toString() : ''
    })

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

    // Parse current value as number, respecting decimal scale
    const getNumericValue = useCallback(
      (val: string): number | undefined => {
        if (val === '' || val === '-') return undefined

        const parsed = parseFloat(val)
        if (isNaN(parsed)) return undefined

        // Format to respect decimal scale
        if (decimalScale !== undefined && val.includes('.')) {
          const [whole, fraction] = val.split('.')
          return parseFloat(`${whole}.${fraction.slice(0, decimalScale)}`)
        }

        return parsed
      },
      [decimalScale]
    )

    // Format number to string with proper decimal places
    const formatValue = useCallback(
      (val: number | undefined): string => {
        if (val === undefined) return ''

        if (decimalScale !== undefined && val.toString().includes('.')) {
          // Use toFixed to respect decimal scale
          return val.toFixed(decimalScale)
        }

        return val.toString()
      },
      [decimalScale]
    )

    const handleIncrement = useCallback(() => {
      const currentValue = getNumericValue(value)
      const newValue = currentValue === undefined ? stepper : Math.min(currentValue + stepper, max)
      setValue(formatValue(newValue))

      if (onChange) {
        onChange(newValue)
      }

      // Preserve focus after value change
      setTimeout(() => {
        if (inputRef.current && document.activeElement !== inputRef.current) {
          inputRef.current.focus()
        }
      }, 0)
    }, [value, stepper, max, onChange, formatValue, getNumericValue])

    const handleDecrement = useCallback(() => {
      const currentValue = getNumericValue(value)
      const newValue =
        currentValue === undefined ? (allowNegative ? -stepper : 0) : Math.max(currentValue - stepper, min)
      setValue(formatValue(newValue))

      if (onChange) {
        onChange(newValue)
      }

      // Preserve focus after value change
      setTimeout(() => {
        if (inputRef.current && document.activeElement !== inputRef.current) {
          inputRef.current.focus()
        }
      }, 0)
    }, [value, stepper, min, onChange, allowNegative, formatValue, getNumericValue])

    // Handle key presses for up/down arrow keys
    const handleKeyDown = useCallback(
      (e: ReactKeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'ArrowUp') {
          e.preventDefault() // Prevent default browser behavior
          handleIncrement()
        } else if (e.key === 'ArrowDown') {
          e.preventDefault() // Prevent default browser behavior
          handleDecrement()
        }
      },
      [handleIncrement, handleDecrement]
    )

    // Update internal state when controlled value changes
    useEffect(() => {
      if (controlledValue !== undefined) {
        setValue(formatValue(controlledValue))
      }
    }, [controlledValue, formatValue])

    // Handle input changes with validation
    const handleInputChange = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value

        // Regular expression to validate user input
        const regex = allowDecimal
          ? allowNegative
            ? /^-?\d*\.?\d*$/ // Allow negative and decimal
            : /^\d*\.?\d*$/ // Allow decimal, no negative
          : allowNegative
            ? /^-?\d*$/ // Allow negative, no decimal
            : /^\d*$/ // No decimal, no negative

        // Only update if input matches our validation regex
        if (regex.test(inputValue) || inputValue === '') {
          setValue(inputValue)

          // Convert to number and call onChange
          const numericValue = getNumericValue(inputValue)
          if (onChange) {
            onChange(numericValue)
          }
        }
      },
      [allowDecimal, allowNegative, onChange, getNumericValue]
    )

    // Validate min/max constraints on blur
    const handleBlur = useCallback(
      (_e: FocusEvent<HTMLInputElement>) => {
        const numericValue = getNumericValue(value)

        if (numericValue !== undefined) {
          let newValue = numericValue

          // Apply min/max constraints
          if (numericValue < min) {
            newValue = min
          } else if (numericValue > max) {
            newValue = max
          }

          // Format the value properly
          const formattedValue = formatValue(newValue)

          if (formattedValue !== value) {
            setValue(formattedValue)
            if (onChange) {
              onChange(newValue)
            }
          }
        }
      },
      [value, min, max, onChange, formatValue, getNumericValue]
    )

    return (
      <ControlGroup className={wrapperClassName}>
        {!!label && (
          <Label disabled={disabled} optional={optional} htmlFor={id}>
            {label}
          </Label>
        )}

        <div className="flex">
          <BaseInput
            type="text"
            ref={setRefs}
            id={id}
            value={value}
            onChange={handleInputChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            theme={theme}
            disabled={disabled}
            suffix={
              showStepper ? (
                <div className="flex flex-col">
                  <Button
                    aria-label={`Increment value by ${stepper}`}
                    className="border-b"
                    variant="ghost"
                    iconOnly
                    onClick={handleIncrement}
                    disabled={disabled || getNumericValue(value) === max}
                    size="sm"
                    type="button"
                  >
                    <Icon name="chevron-up" size={14} />
                  </Button>
                  <Button
                    aria-label={`Decrement value by ${stepper}`}
                    variant="ghost"
                    iconOnly
                    onClick={handleDecrement}
                    disabled={disabled || getNumericValue(value) === min}
                    size="sm"
                    type="button"
                  >
                    <Icon name="chevron-down" size={14} />
                  </Button>
                </div>
              ) : null
            }
            {...props}
          />
        </div>

        {(caption || error || warningMessage) && (
          <Caption theme={theme} message={caption} errorMessage={error} warningMessage={warningMessage} showIcon />
        )}
      </ControlGroup>
    )
  }
)

NumberInput.displayName = 'NumberInput'
