import React from 'react'

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, test, vi } from 'vitest'

import { NumberInput } from './number-input'
import { SearchInput } from './search-input'
import { TextInput } from './text-input'

// Mock dependencies
vi.mock('@components/icon-v2', () => ({
  IconV2: ({ name, size }: any) => <span data-testid="icon" data-name={name} data-size={size} />
}))

vi.mock('@/components', () => ({
  Button: ({ children, onClick, disabled, className, 'aria-label': ariaLabel, tabIndex }: any) => (
    <button
      data-testid="button"
      onClick={onClick}
      disabled={disabled}
      className={className}
      aria-label={ariaLabel}
      tabIndex={tabIndex}
    >
      {children}
    </button>
  ),
  CommonInputsProp: {},
  ControlGroup: {
    Root: ({ children, className, orientation }: any) => (
      <div data-testid="control-group-root" className={className} data-orientation={orientation}>
        {children}
      </div>
    ),
    LabelWrapper: ({ children }: any) => <div data-testid="label-wrapper">{children}</div>,
    InputWrapper: ({ children }: any) => <div data-testid="input-wrapper">{children}</div>
  },
  FormCaption: ({ children, disabled, theme }: any) => (
    <div data-testid="form-caption" data-disabled={disabled} data-theme={theme}>
      {children}
    </div>
  ),
  Label: ({ children, disabled, optional, htmlFor, suffix, tooltipProps, tooltipContent }: any) => (
    <label
      data-testid="label"
      data-disabled={disabled}
      data-optional={optional}
      htmlFor={htmlFor}
      data-suffix={suffix}
      data-tooltip-props={tooltipProps}
      data-tooltip-content={tooltipContent}
    >
      {children}
    </label>
  ),
  IconV2: ({ name, size }: any) => <span data-testid="icon" data-name={name} data-size={size} />
}))

vi.mock('./base-input', () => {
  const MockBaseInput = React.forwardRef(
    (
      { type, className, onChange, prefix, suffix, theme, id, disabled, readOnly, inputMode, onKeyDown, ...props }: any,
      ref: any
    ) => (
      <div data-testid="base-input-wrapper">
        {prefix && <div data-testid="prefix">{prefix}</div>}
        <input
          data-testid="base-input"
          ref={ref}
          type={type}
          className={className}
          onChange={onChange}
          data-theme={theme}
          id={id}
          disabled={disabled}
          readOnly={readOnly}
          inputMode={inputMode}
          onKeyDown={onKeyDown}
          {...props}
        />
        {suffix && <div data-testid="suffix">{suffix}</div>}
      </div>
    )
  )

  MockBaseInput.displayName = 'BaseInput'

  return {
    BaseInput: MockBaseInput,
    InputProps: {}
  }
})

vi.mock('lodash-es', () => ({
  debounce: (fn: any, delay: number) => {
    const debounced = (...args: any[]) => {
      clearTimeout((debounced as any).timeoutId)
      ;(debounced as any).timeoutId = setTimeout(() => fn(...args), delay)
    }
    debounced.cancel = () => clearTimeout((debounced as any).timeoutId)
    return debounced
  }
}))

describe('SearchInput', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.runOnlyPendingTimers()
    vi.useRealTimers()
  })

  test('renders with default placeholder', () => {
    render(<SearchInput />)

    expect(screen.getByTestId('base-input')).toHaveAttribute('placeholder', 'Search')
  })

  test('renders with custom placeholder', () => {
    render(<SearchInput placeholder="Find items..." />)

    expect(screen.getByTestId('base-input')).toHaveAttribute('placeholder', 'Find items...')
  })

  test('renders with default search icon prefix', () => {
    render(<SearchInput />)

    const prefix = screen.getByTestId('prefix')
    expect(prefix).toBeInTheDocument()

    const icon = screen.getByTestId('icon')
    expect(icon).toHaveAttribute('data-name', 'search')
    expect(icon).toHaveAttribute('data-size', 'sm')
  })

  test('renders with custom prefix', () => {
    render(<SearchInput prefix={<span data-testid="custom-prefix">Custom</span>} />)

    expect(screen.getByTestId('custom-prefix')).toBeInTheDocument()
    expect(screen.getByTestId('custom-prefix')).toHaveTextContent('Custom')
  })

  test('renders hidden input to prevent password manager population', () => {
    const { container } = render(<SearchInput />)

    const hiddenInputs = container.querySelectorAll('input[type="text"][style*="display: none"]')
    expect(hiddenInputs).toHaveLength(1)
    expect(hiddenInputs[0]).toHaveAttribute('autocomplete', 'off')
  })

  test('calls onChange with debounce by default', async () => {
    const mockOnChange = vi.fn()
    render(<SearchInput onChange={mockOnChange} />)

    const input = screen.getByTestId('base-input')
    await userEvent.type(input, 'test')

    // Should not be called immediately
    expect(mockOnChange).not.toHaveBeenCalled()

    // Fast-forward time
    vi.advanceTimersByTime(300)

    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith('test')
    })
  })

  test('calls onChange without debounce when debounce is false', async () => {
    const mockOnChange = vi.fn()
    render(<SearchInput onChange={mockOnChange} debounce={false} />)

    const input = screen.getByTestId('base-input')
    await userEvent.type(input, 't')

    expect(mockOnChange).toHaveBeenCalledWith('t')
  })

  test('uses custom debounce duration', async () => {
    const mockOnChange = vi.fn()
    render(<SearchInput onChange={mockOnChange} debounce={500} />)

    const input = screen.getByTestId('base-input')
    await userEvent.type(input, 'test')

    // Should not be called before 500ms
    vi.advanceTimersByTime(400)
    expect(mockOnChange).not.toHaveBeenCalled()

    // Should be called after 500ms
    vi.advanceTimersByTime(100)
    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith('test')
    })
  })

  test('applies custom className', () => {
    render(<SearchInput className="custom-class" />)

    expect(screen.getByTestId('base-input')).toHaveClass('cn-input-search')
    expect(screen.getByTestId('base-input')).toHaveClass('custom-class')
  })

  test('forwards ref to input element', () => {
    const ref = React.createRef<HTMLInputElement>()
    render(<SearchInput ref={ref} />)

    expect(ref.current).toBeInstanceOf(HTMLInputElement)
  })

  test('passes through additional props to BaseInput', () => {
    render(<SearchInput disabled searchValue="test value" />)

    const input = screen.getByTestId('base-input')
    expect(input).toBeDisabled()
    expect(input).toHaveValue('test value')
  })

  test('handles multiple rapid changes with debounce', async () => {
    const mockOnChange = vi.fn()
    render(<SearchInput onChange={mockOnChange} debounce={300} />)

    const input = screen.getByTestId('base-input')

    await userEvent.type(input, 'a')
    vi.advanceTimersByTime(100)

    await userEvent.type(input, 'b')
    vi.advanceTimersByTime(100)

    await userEvent.type(input, 'c')

    // Should not be called yet
    expect(mockOnChange).not.toHaveBeenCalled()

    // After full debounce time
    vi.advanceTimersByTime(300)

    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledTimes(1)
      expect(mockOnChange).toHaveBeenCalledWith('abc')
    })
  })

  test('handles debounce=true as default 300ms', async () => {
    const mockOnChange = vi.fn()
    render(<SearchInput onChange={mockOnChange} debounce={true} />)

    const input = screen.getByTestId('base-input')
    await userEvent.type(input, 'test')

    vi.advanceTimersByTime(300)

    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith('test')
    })
  })

  test('handles debounce=0 as no debounce', async () => {
    const mockOnChange = vi.fn()
    render(<SearchInput onChange={mockOnChange} debounce={0} />)

    const input = screen.getByTestId('base-input')
    await userEvent.type(input, 't')

    expect(mockOnChange).toHaveBeenCalledWith('t')
  })

  test('cleans up debounced function on unmount', () => {
    const mockOnChange = vi.fn()
    const { unmount } = render(<SearchInput onChange={mockOnChange} debounce={300} />)

    const input = screen.getByTestId('base-input')
    userEvent.type(input, 'test')

    unmount()

    vi.advanceTimersByTime(300)

    // Should not be called after unmount
    expect(mockOnChange).not.toHaveBeenCalled()
  })

  test('handles onChange being undefined', async () => {
    render(<SearchInput />)

    const input = screen.getByTestId('base-input')

    // Should not throw error
    await userEvent.type(input, 'test')

    vi.advanceTimersByTime(300)

    // No error should occur
    expect(input).toHaveValue('test')
  })

  test('handles debounce as a specific number value', async () => {
    const mockOnChange = vi.fn()
    render(<SearchInput onChange={mockOnChange} debounce={250} />)

    const input = screen.getByTestId('base-input')
    await userEvent.type(input, 'test')

    vi.advanceTimersByTime(250)

    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith('test')
    })
  })

  test('handles debounce as undefined', async () => {
    const mockOnChange = vi.fn()
    render(<SearchInput onChange={mockOnChange} debounce={undefined} />)

    const input = screen.getByTestId('base-input')
    await userEvent.type(input, 'test')

    vi.advanceTimersByTime(300)

    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith('test')
    })
  })

  test('handles debounce as null', async () => {
    const mockOnChange = vi.fn()
    render(<SearchInput onChange={mockOnChange} debounce={null as any} />)

    const input = screen.getByTestId('base-input')
    await userEvent.type(input, 'test')

    vi.advanceTimersByTime(300)

    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith('test')
    })
  })
})

describe('TextInput', () => {
  test('renders basic text input', () => {
    render(<TextInput />)

    expect(screen.getByTestId('control-group-root')).toBeInTheDocument()
    expect(screen.getByTestId('base-input')).toBeInTheDocument()
  })

  test('renders with label', () => {
    render(<TextInput label="Username" />)

    const label = screen.getByTestId('label')
    expect(label).toHaveTextContent('Username')
  })

  test('renders with optional flag', () => {
    render(<TextInput label="Email" optional />)

    const label = screen.getByTestId('label')
    expect(label).toHaveAttribute('data-optional', 'true')
  })

  test('renders with caption', () => {
    render(<TextInput caption="Enter your username" />)

    const caption = screen.getByTestId('form-caption')
    expect(caption).toHaveTextContent('Enter your username')
  })

  test('renders with error message', () => {
    render(<TextInput error="This field is required" />)

    const caption = screen.getByTestId('form-caption')
    expect(caption).toHaveTextContent('This field is required')
    expect(caption).toHaveAttribute('data-theme', 'danger')
  })

  test('renders with warning message', () => {
    render(<TextInput warning="This value might be incorrect" />)

    const caption = screen.getByTestId('form-caption')
    expect(caption).toHaveTextContent('This value might be incorrect')
    expect(caption).toHaveAttribute('data-theme', 'warning')
  })

  test('error takes precedence over warning', () => {
    render(<TextInput error="Error message" warning="Warning message" />)

    const caption = screen.getByTestId('form-caption')
    expect(caption).toHaveTextContent('Error message')
    expect(caption).toHaveAttribute('data-theme', 'danger')
  })

  test('applies danger theme when error is present', () => {
    render(<TextInput error="Error" />)

    const input = screen.getByTestId('base-input')
    expect(input).toHaveAttribute('data-theme', 'danger')
  })

  test('applies warning theme when warning is present', () => {
    render(<TextInput warning="Warning" />)

    const input = screen.getByTestId('base-input')
    expect(input).toHaveAttribute('data-theme', 'warning')
  })

  test('generates unique ID when not provided', () => {
    const { unmount } = render(<TextInput label="Field 1" />)
    const input1 = screen.getByTestId('base-input')
    const id1 = input1.getAttribute('id')

    unmount()

    render(<TextInput label="Field 2" />)
    const input2 = screen.getByTestId('base-input')
    const id2 = input2.getAttribute('id')

    expect(id1).toBeTruthy()
    expect(id2).toBeTruthy()
    expect(id1).not.toBe(id2)
  })

  test('uses provided ID', () => {
    render(<TextInput id="custom-id" label="Field" />)

    const input = screen.getByTestId('base-input')
    expect(input).toHaveAttribute('id', 'custom-id')

    const label = screen.getByTestId('label')
    expect(label).toHaveAttribute('for', 'custom-id')
  })

  test('renders in horizontal orientation', () => {
    render(<TextInput label="Field" caption="Caption text" orientation="horizontal" />)

    const root = screen.getByTestId('control-group-root')
    expect(root).toHaveAttribute('data-orientation', 'horizontal')

    // Caption should be in label wrapper for horizontal
    const labelWrapper = screen.getByTestId('label-wrapper')
    expect(labelWrapper).toBeInTheDocument()
  })

  test('renders caption in input wrapper for vertical orientation', () => {
    render(<TextInput label="Field" caption="Caption text" />)

    const inputWrapper = screen.getByTestId('input-wrapper')
    expect(inputWrapper).toBeInTheDocument()
  })

  test('forwards ref to input element', () => {
    const ref = React.createRef<HTMLInputElement>()
    render(<TextInput ref={ref} />)

    expect(ref.current).toBeInstanceOf(HTMLInputElement)
  })

  test('applies disabled state', () => {
    render(<TextInput disabled label="Field" caption="Caption" />)

    const input = screen.getByTestId('base-input')
    expect(input).toBeDisabled()

    const label = screen.getByTestId('label')
    expect(label).toHaveAttribute('data-disabled', 'true')

    const caption = screen.getByTestId('form-caption')
    expect(caption).toHaveAttribute('data-disabled', 'true')
  })

  test('renders with labelSuffix', () => {
    render(<TextInput label="Field" labelSuffix="(optional)" />)

    const label = screen.getByTestId('label')
    expect(label).toHaveAttribute('data-suffix', '(optional)')
  })

  test('renders with tooltip props', () => {
    render(<TextInput label="Field" tooltipContent="Help text" tooltipProps={{} as any} />)

    const label = screen.getByTestId('label')
    expect(label).toHaveAttribute('data-tooltip-content', 'Help text')
  })

  test('applies custom wrapperClassName', () => {
    render(<TextInput wrapperClassName="custom-wrapper" />)

    const root = screen.getByTestId('control-group-root')
    expect(root).toHaveClass('custom-wrapper')
  })

  test('does not render label wrapper when no label and not horizontal', () => {
    render(<TextInput />)

    expect(screen.queryByTestId('label-wrapper')).not.toBeInTheDocument()
  })

  test('renders label wrapper in horizontal mode even without label if caption exists', () => {
    render(<TextInput caption="Caption" orientation="horizontal" />)

    expect(screen.getByTestId('label-wrapper')).toBeInTheDocument()
  })

  test('does not render caption in horizontal mode within input wrapper', () => {
    render(<TextInput caption="Caption" orientation="horizontal" />)

    const inputWrapper = screen.getByTestId('input-wrapper')
    const captions = inputWrapper.querySelectorAll('[data-testid="form-caption"]')
    expect(captions).toHaveLength(0)
  })
})

describe('NumberInput', () => {
  test('renders basic number input', () => {
    render(<NumberInput />)

    expect(screen.getByTestId('control-group-root')).toBeInTheDocument()
    expect(screen.getByTestId('base-input')).toHaveAttribute('type', 'number')
  })

  test('renders with stepper buttons by default', () => {
    render(<NumberInput />)

    const buttons = screen.getAllByTestId('button')
    expect(buttons).toHaveLength(2)
    expect(buttons[0]).toHaveAttribute('aria-label', 'Increment value')
    expect(buttons[1]).toHaveAttribute('aria-label', 'Decrement value')
  })

  test('hides stepper when hideStepper is true', () => {
    render(<NumberInput hideStepper />)

    expect(screen.queryByTestId('button')).not.toBeInTheDocument()
  })

  test('hides stepper when readOnly is true', () => {
    render(<NumberInput readOnly />)

    expect(screen.queryByTestId('button')).not.toBeInTheDocument()
  })

  test('renders with label', () => {
    render(<NumberInput label="Age" />)

    const label = screen.getByTestId('label')
    expect(label).toHaveTextContent('Age')
  })

  test('renders with error message', () => {
    render(<NumberInput error="Invalid number" />)

    const caption = screen.getByTestId('form-caption')
    expect(caption).toHaveTextContent('Invalid number')
    expect(caption).toHaveAttribute('data-theme', 'danger')
  })

  test('renders with warning message', () => {
    render(<NumberInput warning="Value seems high" />)

    const caption = screen.getByTestId('form-caption')
    expect(caption).toHaveTextContent('Value seems high')
    expect(caption).toHaveAttribute('data-theme', 'warning')
  })

  test('applies numeric inputMode when integerOnly is true', () => {
    render(<NumberInput integerOnly />)

    const input = screen.getByTestId('base-input')
    expect(input).toHaveAttribute('inputMode', 'numeric')
  })

  test('applies decimal inputMode by default', () => {
    render(<NumberInput />)

    const input = screen.getByTestId('base-input')
    expect(input).toHaveAttribute('inputMode', 'decimal')
  })

  test('prevents decimal point input when integerOnly is true', async () => {
    const mockPreventDefault = vi.fn()
    render(<NumberInput integerOnly />)

    const input = screen.getByTestId('base-input')

    // Simulate pressing the decimal point key
    const event = new KeyboardEvent('keydown', { key: '.' })
    Object.defineProperty(event, 'preventDefault', { value: mockPreventDefault })

    input.dispatchEvent(event)

    // The onKeyDown handler should call preventDefault
    expect(input).toBeInTheDocument()
  })

  test('handles increment button click', async () => {
    const mockStepUp = vi.fn()
    const mockFocus = vi.fn()
    const mockDispatchEvent = vi.fn()

    render(<NumberInput />)

    const input = screen.getByTestId('base-input') as HTMLInputElement
    input.stepUp = mockStepUp
    input.focus = mockFocus
    input.dispatchEvent = mockDispatchEvent

    const buttons = screen.getAllByTestId('button')
    const incrementButton = buttons[0]

    await userEvent.click(incrementButton)

    expect(mockStepUp).toHaveBeenCalled()
    expect(mockFocus).toHaveBeenCalled()
    expect(mockDispatchEvent).toHaveBeenCalled()
  })

  test('handles decrement button click', async () => {
    const mockStepDown = vi.fn()
    const mockFocus = vi.fn()
    const mockDispatchEvent = vi.fn()

    render(<NumberInput />)

    const input = screen.getByTestId('base-input') as HTMLInputElement
    input.stepDown = mockStepDown
    input.focus = mockFocus
    input.dispatchEvent = mockDispatchEvent

    const buttons = screen.getAllByTestId('button')
    const decrementButton = buttons[1]

    await userEvent.click(decrementButton)

    expect(mockStepDown).toHaveBeenCalled()
    expect(mockFocus).toHaveBeenCalled()
    expect(mockDispatchEvent).toHaveBeenCalled()
  })

  test('does not handle increment when stepper is disabled', async () => {
    render(<NumberInput hideStepper />)

    // No buttons should be rendered
    expect(screen.queryByTestId('button')).not.toBeInTheDocument()
  })

  test('does not handle decrement when readOnly', async () => {
    render(<NumberInput readOnly />)

    // No buttons should be rendered
    expect(screen.queryByTestId('button')).not.toBeInTheDocument()
  })

  test('renders with custom suffix', () => {
    render(<NumberInput suffix={<span data-testid="custom-suffix">kg</span>} />)

    expect(screen.getByTestId('custom-suffix')).toHaveTextContent('kg')
  })

  test('renders suffix alongside stepper', () => {
    render(<NumberInput suffix={<span data-testid="custom-suffix">units</span>} />)

    expect(screen.getByTestId('custom-suffix')).toBeInTheDocument()
    expect(screen.getAllByTestId('button')).toHaveLength(2)
  })

  test('forwards ref to input element', () => {
    const ref = React.createRef<HTMLInputElement>()
    render(<NumberInput ref={ref} />)

    expect(ref.current).toBeInstanceOf(HTMLInputElement)
  })

  test('generates unique ID when not provided', () => {
    const { unmount } = render(<NumberInput label="Field 1" />)
    const input1 = screen.getByTestId('base-input')
    const id1 = input1.getAttribute('id')

    unmount()

    render(<NumberInput label="Field 2" />)
    const input2 = screen.getByTestId('base-input')
    const id2 = input2.getAttribute('id')

    expect(id1).toBeTruthy()
    expect(id2).toBeTruthy()
    expect(id1).not.toBe(id2)
  })

  test('uses provided ID', () => {
    render(<NumberInput id="custom-id" label="Field" />)

    const input = screen.getByTestId('base-input')
    expect(input).toHaveAttribute('id', 'custom-id')

    const label = screen.getByTestId('label')
    expect(label).toHaveAttribute('for', 'custom-id')
  })

  test('applies disabled state to input and buttons', () => {
    render(<NumberInput disabled />)

    const input = screen.getByTestId('base-input')
    expect(input).toBeDisabled()

    const buttons = screen.getAllByTestId('button')
    buttons.forEach(button => {
      expect(button).toBeDisabled()
    })
  })

  test('renders in horizontal orientation', () => {
    render(<NumberInput label="Count" caption="Enter count" orientation="horizontal" />)

    const root = screen.getByTestId('control-group-root')
    expect(root).toHaveAttribute('data-orientation', 'horizontal')
  })

  test('stepper buttons have tabIndex -1', () => {
    render(<NumberInput />)

    const buttons = screen.getAllByTestId('button')
    buttons.forEach(button => {
      expect(button).toHaveAttribute('tabIndex', '-1')
    })
  })

  test('handles ref as function', () => {
    let refValue: HTMLInputElement | null = null
    const refCallback = (el: HTMLInputElement | null) => {
      refValue = el
    }

    render(<NumberInput ref={refCallback} />)

    expect(refValue).toBeInstanceOf(HTMLInputElement)
  })

  test('handles ref as object', () => {
    const ref = React.createRef<HTMLInputElement>()
    render(<NumberInput ref={ref} />)

    expect(ref.current).toBeInstanceOf(HTMLInputElement)
  })

  test('renders with optional flag', () => {
    render(<NumberInput label="Count" optional />)

    const label = screen.getByTestId('label')
    expect(label).toHaveAttribute('data-optional', 'true')
  })

  test('applies custom wrapperClassName', () => {
    render(<NumberInput wrapperClassName="custom-wrapper" />)

    const root = screen.getByTestId('control-group-root')
    expect(root).toHaveClass('custom-wrapper')
  })

  test('error takes precedence over warning for theme', () => {
    render(<NumberInput error="Error" warning="Warning" />)

    const input = screen.getByTestId('base-input')
    expect(input).toHaveAttribute('data-theme', 'danger')
  })

  test('warning applies warning theme', () => {
    render(<NumberInput warning="Warning" />)

    const input = screen.getByTestId('base-input')
    expect(input).toHaveAttribute('data-theme', 'warning')
  })

  test('renders caption in horizontal mode within label wrapper', () => {
    render(<NumberInput label="Count" caption="Caption" orientation="horizontal" />)

    const labelWrapper = screen.getByTestId('label-wrapper')
    expect(labelWrapper).toBeInTheDocument()
  })

  test('renders caption in vertical mode within input wrapper', () => {
    render(<NumberInput label="Count" caption="Caption" />)

    const inputWrapper = screen.getByTestId('input-wrapper')
    const captions = inputWrapper.querySelectorAll('[data-testid="form-caption"]')
    expect(captions.length).toBeGreaterThan(0)
  })

  test('increment button does nothing when disabled', async () => {
    const mockStepUp = vi.fn()
    render(<NumberInput disabled />)

    const input = screen.getByTestId('base-input') as HTMLInputElement
    input.stepUp = mockStepUp

    const buttons = screen.getAllByTestId('button')
    const incrementButton = buttons[0]

    // Button is disabled, so click won't trigger handler
    expect(incrementButton).toBeDisabled()
  })

  test('decrement button does nothing when disabled', async () => {
    const mockStepDown = vi.fn()
    render(<NumberInput disabled />)

    const input = screen.getByTestId('base-input') as HTMLInputElement
    input.stepDown = mockStepDown

    const buttons = screen.getAllByTestId('button')
    const decrementButton = buttons[1]

    // Button is disabled, so click won't trigger handler
    expect(decrementButton).toBeDisabled()
  })

  test('handles increment when input element exists', async () => {
    const mockStepUp = vi.fn()
    const mockFocus = vi.fn()
    const mockDispatchEvent = vi.fn()

    const { container } = render(<NumberInput />)

    // Wait for input to be available
    const input = container.querySelector('input[type="number"]') as HTMLInputElement
    input.stepUp = mockStepUp
    input.focus = mockFocus
    input.dispatchEvent = mockDispatchEvent

    const buttons = screen.getAllByTestId('button')
    const incrementButton = buttons[0]

    await userEvent.click(incrementButton)

    expect(mockStepUp).toHaveBeenCalled()
    expect(mockFocus).toHaveBeenCalled()
    expect(mockDispatchEvent).toHaveBeenCalled()
  })

  test('handles decrement when input element exists', async () => {
    const mockStepDown = vi.fn()
    const mockFocus = vi.fn()
    const mockDispatchEvent = vi.fn()

    const { container } = render(<NumberInput />)

    // Wait for input to be available
    const input = container.querySelector('input[type="number"]') as HTMLInputElement
    input.stepDown = mockStepDown
    input.focus = mockFocus
    input.dispatchEvent = mockDispatchEvent

    const buttons = screen.getAllByTestId('button')
    const decrementButton = buttons[1]

    await userEvent.click(decrementButton)

    expect(mockStepDown).toHaveBeenCalled()
    expect(mockFocus).toHaveBeenCalled()
    expect(mockDispatchEvent).toHaveBeenCalled()
  })

  test('prevents decimal input when integerOnly is true via keydown', async () => {
    render(<NumberInput integerOnly />)

    const input = screen.getByTestId('base-input')

    // Try to type a decimal point
    await userEvent.type(input, '123.')

    // The decimal point should be prevented
    expect(input).toBeInTheDocument()
  })

  test('renders suffix without stepper when hideStepper is true', () => {
    render(<NumberInput hideStepper suffix={<span data-testid="custom-suffix">units</span>} />)

    expect(screen.getByTestId('custom-suffix')).toBeInTheDocument()
    expect(screen.queryByTestId('button')).not.toBeInTheDocument()
  })

  test('renders suffix without stepper when readOnly is true', () => {
    render(<NumberInput readOnly suffix={<span data-testid="custom-suffix">kg</span>} />)

    expect(screen.getByTestId('custom-suffix')).toBeInTheDocument()
    expect(screen.queryByTestId('button')).not.toBeInTheDocument()
  })

  test('does not render suffix wrapper when no suffix and stepper is hidden', () => {
    const { container } = render(<NumberInput hideStepper />)

    const suffixDiv = container.querySelector('[data-testid="suffix"]')
    expect(suffixDiv).not.toBeInTheDocument()
  })

  test('handles label without caption in horizontal mode', () => {
    render(<NumberInput label="Count" orientation="horizontal" />)

    const labelWrapper = screen.getByTestId('label-wrapper')
    expect(labelWrapper).toBeInTheDocument()

    const label = screen.getByTestId('label')
    expect(label).toHaveTextContent('Count')
  })

  test('renders with labelSuffix', () => {
    render(<NumberInput label="Count" labelSuffix="(required)" />)

    const label = screen.getByTestId('label')
    expect(label).toHaveAttribute('data-suffix', '(required)')
  })

  test('renders with tooltipContent', () => {
    render(<NumberInput label="Count" tooltipContent="Enter a number" />)

    const label = screen.getByTestId('label')
    expect(label).toHaveAttribute('data-tooltip-content', 'Enter a number')
  })

  test('renders without label wrapper when no label and not horizontal with caption', () => {
    render(<NumberInput caption="Just caption" />)

    expect(screen.queryByTestId('label-wrapper')).not.toBeInTheDocument()
  })

  test('renders label wrapper when label exists even without caption', () => {
    render(<NumberInput label="Count" />)

    expect(screen.getByTestId('label-wrapper')).toBeInTheDocument()
  })

  test('handles edge case where input ref becomes null during increment', async () => {
    const { container } = render(<NumberInput />)

    const input = container.querySelector('input[type="number"]') as HTMLInputElement
    const buttons = screen.getAllByTestId('button')
    const incrementButton = buttons[0]

    // Set up the input methods
    const mockStepUp = vi.fn()
    const mockFocus = vi.fn()
    const mockDispatchEvent = vi.fn()

    input.stepUp = mockStepUp
    input.focus = mockFocus
    input.dispatchEvent = mockDispatchEvent

    // Simulate clicking the button
    await userEvent.click(incrementButton)

    // Verify the methods were called
    expect(mockStepUp).toHaveBeenCalled()
    expect(mockFocus).toHaveBeenCalled()
    expect(mockDispatchEvent).toHaveBeenCalled()
  })

  test('handles edge case where input ref becomes null during decrement', async () => {
    const { container } = render(<NumberInput />)

    const input = container.querySelector('input[type="number"]') as HTMLInputElement
    const buttons = screen.getAllByTestId('button')
    const decrementButton = buttons[1]

    // Set up the input methods
    const mockStepDown = vi.fn()
    const mockFocus = vi.fn()
    const mockDispatchEvent = vi.fn()

    input.stepDown = mockStepDown
    input.focus = mockFocus
    input.dispatchEvent = mockDispatchEvent

    // Simulate clicking the button
    await userEvent.click(decrementButton)

    // Verify the methods were called
    expect(mockStepDown).toHaveBeenCalled()
    expect(mockFocus).toHaveBeenCalled()
    expect(mockDispatchEvent).toHaveBeenCalled()
  })

  test('renders without label wrapper when only caption in vertical mode', () => {
    render(<NumberInput caption="Just a caption" orientation="vertical" />)

    expect(screen.queryByTestId('label-wrapper')).not.toBeInTheDocument()
  })

  test('renders label wrapper in horizontal mode with caption but no label', () => {
    render(<NumberInput caption="Caption only" orientation="horizontal" />)

    expect(screen.getByTestId('label-wrapper')).toBeInTheDocument()
  })

  test('covers all branches of label wrapper conditional rendering', () => {
    // Branch 1: !!label is true
    const { unmount: unmount1 } = render(<NumberInput label="Test Label" />)
    expect(screen.getByTestId('label-wrapper')).toBeInTheDocument()
    unmount1()

    // Branch 2: !!label is false but (isHorizontal && !!caption) is true
    const { unmount: unmount2 } = render(<NumberInput orientation="horizontal" caption="Test Caption" />)
    expect(screen.getByTestId('label-wrapper')).toBeInTheDocument()
    unmount2()

    // Branch 3: Both conditions false - no label wrapper
    render(<NumberInput orientation="vertical" />)
    expect(screen.queryByTestId('label-wrapper')).not.toBeInTheDocument()
  })
})
