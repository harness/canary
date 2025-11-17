import React from 'react'
import { FormProvider, useForm, UseFormReturn, type DefaultValues } from 'react-hook-form'

import { Checkbox, FormWrapperContext, Radio, Select, TextInput } from '@/components'
import { act, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { withForm } from '../components/form-hoc'

const mockState = vi.hoisted(() => ({
  lastTextInputProps: undefined as any,
  lastCheckboxProps: undefined as any,
  lastRadioProps: undefined as any,
  lastSelectProps: undefined as any
}))

vi.mock('@/components', () => {
  const { forwardRef, createContext } = React

  const context = createContext<{ orientation: 'vertical' | 'horizontal' }>({
    orientation: 'vertical'
  })

  const TextInput = forwardRef<HTMLInputElement, any>((props, ref) => {
    mockState.lastTextInputProps = props
    return (
      <input
        ref={ref}
        data-testid="text-input"
        value={props.value ?? ''}
        data-orientation={props.orientation}
        data-error={props.error}
        onChange={event => props.onChange?.(event)}
        {...props}
      />
    )
  })
  TextInput.displayName = 'TextInputMock'

  const Textarea = forwardRef<HTMLTextAreaElement, any>((props, ref) => (
    <textarea ref={ref} data-testid="textarea-input" value={props.value ?? ''} {...props} />
  ))
  Textarea.displayName = 'TextareaMock'

  const NumberInput = forwardRef<HTMLInputElement, any>((props, ref) => (
    <input ref={ref} data-testid="number-input" type="number" value={props.value ?? ''} {...props} />
  ))
  NumberInput.displayName = 'NumberInputMock'

  const Checkbox = forwardRef<HTMLInputElement, any>(({ onCheckedChange, checked, ...props }, ref) => {
    mockState.lastCheckboxProps = { onCheckedChange, checked, ...props }
    return (
      <input
        ref={ref}
        type="checkbox"
        data-testid="checkbox-input"
        checked={!!checked}
        onChange={event => onCheckedChange?.(event.target.checked)}
        {...props}
      />
    )
  })
  Checkbox.displayName = 'CheckboxMock'

  const RadioRoot = ({ onValueChange, value, ...props }: any) => {
    mockState.lastRadioProps = { onValueChange, value, ...props }
    return (
      <button
        type="button"
        data-testid="radio-root"
        onClick={() => onValueChange?.(value === 'grid' ? 'list' : 'grid')}
        {...props}
      >
        Radio
      </button>
    )
  }

  const MultiSelect = ({ onChange, value, ...props }: any) => (
    <button
      type="button"
      data-testid="multi-select"
      onClick={() => onChange?.([...(Array.isArray(value) ? value : []), 'one'])}
      {...props}
    >
      MultiSelect
    </button>
  )

  const Select = forwardRef<HTMLButtonElement, any>(({ onChange, ...props }, ref) => {
    mockState.lastSelectProps = { onChange, ...props }
    return (
      <button type="button" ref={ref} data-testid="select-control" onClick={() => onChange?.('production')} {...props}>
        Select
      </button>
    )
  })
  Select.displayName = 'SelectMock'

  return {
    FormWrapperContext: context,
    Checkbox,
    MultiSelect,
    NumberInput,
    Radio: { Root: RadioRoot },
    Select,
    Textarea,
    TextInput
  }
})

const renderWithForm = <T extends Record<string, unknown>>(
  ui: React.ReactElement,
  { defaultValues, orientation = 'vertical' }: { defaultValues: T; orientation?: 'vertical' | 'horizontal' }
) => {
  const methodsRef: { current: UseFormReturn<T> | null } = { current: null }

  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    const methods = useForm<T>({ defaultValues: defaultValues as DefaultValues<T> })
    methodsRef.current = methods

    return (
      <FormWrapperContext.Provider value={{ orientation }}>
        <FormProvider {...methods}>{children}</FormProvider>
      </FormWrapperContext.Provider>
    )
  }

  const renderResult = render(ui, { wrapper: Wrapper })

  if (!methodsRef.current) {
    throw new Error('Form methods were not initialized')
  }

  return { ...renderResult, methods: methodsRef.current }
}

describe('withForm HOC', () => {
  beforeEach(() => {
    mockState.lastTextInputProps = undefined
    mockState.lastCheckboxProps = undefined
    mockState.lastRadioProps = undefined
    mockState.lastSelectProps = undefined
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('throws when used without FormProvider', () => {
    const Primitive = React.forwardRef<HTMLDivElement, any>((props, ref) => <div ref={ref} {...props} />)
    Primitive.displayName = 'Primitive'
    const Wrapped = withForm(Primitive)

    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    expect(() => render(<Wrapped name="field" />)).toThrowError(
      'Form-Primitive must be used within a FormProvider context through FormWrapper. Use the standalone Primitive component if form integration is not required.'
    )
    consoleErrorSpy.mockRestore()

    expect(Wrapped.displayName).toBe('withForm(Primitive)')
  })

  it('passes orientation and manages form state/errors', async () => {
    const WrappedTextInput = withForm(TextInput)
    const { methods: form } = renderWithForm(<WrappedTextInput name="name" error="Client error" />, {
      defaultValues: { name: '' },
      orientation: 'horizontal'
    })

    expect(mockState.lastTextInputProps.orientation).toBe('horizontal')
    expect(mockState.lastTextInputProps.error).toBe('Client error')

    await userEvent.type(screen.getByTestId('text-input'), 'abc')
    expect(form.getValues('name')).toBe('abc')

    act(() => {
      form.setError('name', { type: 'manual', message: 'Server error' })
    })

    await waitFor(() => {
      expect(mockState.lastTextInputProps.error).toBe('Server error')
    })
  })

  it('wires checkbox inputs through overriding props', async () => {
    const WrappedCheckbox = withForm(Checkbox, ({ field }) => ({
      checked: field.value,
      onCheckedChange: field.onChange
    }))

    const { methods: form } = renderWithForm(<WrappedCheckbox name="agree" />, {
      defaultValues: { agree: false },
      orientation: 'vertical'
    })

    const checkbox = (await screen.findByTestId('checkbox-input')) as HTMLInputElement
    expect(checkbox.checked).toBe(false)

    await userEvent.click(checkbox)
    expect(form.getValues('agree')).toBe(true)
  })

  it('updates radio values via custom onValueChange mapping', async () => {
    const WrappedRadio = withForm(Radio.Root, ({ field }) => ({
      value: field.value,
      onValueChange: field.onChange
    }))

    const { methods: form } = renderWithForm(<WrappedRadio name="view" />, {
      defaultValues: { view: 'grid' },
      orientation: 'vertical'
    })

    const radioButton = await screen.findByTestId('radio-root')

    await userEvent.click(radioButton)
    expect(form.getValues('view')).toBe('list')
  })

  it('propagates select changes to form state', async () => {
    const WrappedSelect = withForm(Select)

    const { methods: form } = renderWithForm(
      <WrappedSelect
        name="environment"
        options={[{ label: 'Production', value: 'production' }]}
        placeholder="Select environment"
      />,
      {
        defaultValues: { environment: '' },
        orientation: 'vertical'
      }
    )

    const selectControl = await screen.findByTestId('select-control')

    await userEvent.click(selectControl)
    expect(form.getValues('environment')).toBe('production')
  })
})
