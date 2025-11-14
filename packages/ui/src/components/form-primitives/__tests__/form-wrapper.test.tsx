import { useContext } from 'react'

import { fireEvent, render, screen } from '@testing-library/react'
import { vi } from 'vitest'

import { FormWrapper, FormWrapperContext } from '../form-wrapper'

const formProviderCalls: any[] = []

vi.mock('react-hook-form', () => ({
  FormProvider: ({ children, ...props }: any) => {
    formProviderCalls.push(props)
    return (
      <div data-testid="mock-form-provider" data-prop-count={Object.keys(props).length}>
        {children}
      </div>
    )
  }
}))

const createFormMethods = () => ({
  formState: { isDirty: false },
  control: {},
  register: vi.fn(),
  handleSubmit: vi.fn(),
  reset: vi.fn(),
  watch: vi.fn(),
  setValue: vi.fn(),
  getValues: vi.fn(),
  setError: vi.fn(),
  clearErrors: vi.fn(),
  setFocus: vi.fn(),
  resetField: vi.fn(),
  getFieldState: vi.fn(),
  trigger: vi.fn(),
  unregister: vi.fn()
})

describe('FormWrapper', () => {
  beforeEach(() => {
    formProviderCalls.length = 0
  })

  it('renders form with provided props and forwards to FormProvider', () => {
    const methods = createFormMethods()
    const onSubmit = vi.fn()
    const formRef = vi.fn()

    render(
      <FormWrapper
        {...(methods as any)}
        data-testid="wrapper"
        className="custom-form"
        onSubmit={onSubmit}
        formRef={formRef}
        id="test-form"
        orientation="horizontal"
      >
        <span>Child content</span>
      </FormWrapper>
    )

    const provider = screen.getByTestId('mock-form-provider')
    expect(provider).toBeInTheDocument()
    expect(formProviderCalls).toHaveLength(1)
    expect(formProviderCalls[0].register).toBe(methods.register)
    expect(formProviderCalls[0].handleSubmit).toBe(methods.handleSubmit)
    expect(formProviderCalls[0].formState).toBe(methods.formState)
    expect(formProviderCalls[0].control).toBe(methods.control)

    const form = provider.querySelector('form') as HTMLFormElement
    expect(form).toHaveClass('cn-form', 'custom-form')
    expect(form).toHaveAttribute('id', 'test-form')
    expect(form).toHaveAttribute('novalidate')
    expect(screen.getByText('Child content')).toBeInTheDocument()

    fireEvent.submit(form)
    expect(onSubmit).toHaveBeenCalled()
    expect(formRef).toHaveBeenCalledWith(form)
  })

  it('provides orientation context with default vertical value', () => {
    const methods = createFormMethods()

    const OrientationReader = () => {
      const value = useContext(FormWrapperContext)
      return <span data-testid="orientation">{value.orientation}</span>
    }

    render(
      <FormWrapper {...(methods as any)}>
        <OrientationReader />
      </FormWrapper>
    )

    expect(screen.getByTestId('orientation')).toHaveTextContent('vertical')
  })

  it('overrides context orientation when provided', () => {
    const methods = createFormMethods()

    const OrientationReader = () => {
      const value = useContext(FormWrapperContext)
      return <span data-testid="orientation">{value.orientation}</span>
    }

    render(
      <FormWrapper {...(methods as any)} orientation="horizontal">
        <OrientationReader />
      </FormWrapper>
    )

    expect(screen.getByTestId('orientation')).toHaveTextContent('horizontal')
  })
})
