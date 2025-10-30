import { render, RenderResult, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

import { Form, FormControl, FormDescription, FormField, FormItem, FormMessage, useForm, useFormField } from '../form'
import { Input } from '../input'

const renderComponent = (onSubmit = vi.fn()): RenderResult => {
  const TestComponent = () => {
    const form = useForm({
      defaultValues: {
        username: '',
        email: ''
      }
    })

    return (
      <Form form={form} onSubmit={onSubmit}>
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} placeholder="Username" />
              </FormControl>
              <FormDescription>Enter your username</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <button type="submit">Submit</button>
      </Form>
    )
  }

  return render(<TestComponent />)
}

describe('Form', () => {
  describe('Form Component', () => {
    test('should render form element', () => {
      renderComponent()

      const form = document.querySelector('form')
      expect(form).toBeInTheDocument()
    })

    test('should handle form submission', async () => {
      const handleSubmit = vi.fn()
      renderComponent(handleSubmit)

      const submitButton = screen.getByRole('button', { name: 'Submit' })
      await userEvent.click(submitButton)

      await waitFor(() => {
        expect(handleSubmit).toHaveBeenCalled()
      })
    })

    test('should provide form context to children', () => {
      renderComponent()

      const input = screen.getByPlaceholderText('Username')
      expect(input).toBeInTheDocument()
    })

    test('should render with custom className', () => {
      const TestComponent = () => {
        const form = useForm()
        return (
          <Form form={form} onSubmit={vi.fn()} className="custom-form">
            <div>Form content</div>
          </Form>
        )
      }

      const { container } = render(<TestComponent />)
      const formElement = container.querySelector('.custom-form')
      expect(formElement).toBeInTheDocument()
    })

    test('should pass through HTML form attributes', () => {
      const TestComponent = () => {
        const form = useForm()
        return (
          <Form form={form} onSubmit={vi.fn()} id="test-form" noValidate>
            <div>Content</div>
          </Form>
        )
      }

      const { container } = render(<TestComponent />)
      const formElement = container.querySelector('#test-form')
      expect(formElement).toBeInTheDocument()
      expect(formElement).toHaveAttribute('noValidate')
    })
  })

  describe('FormField', () => {
    test('should render field with control', () => {
      renderComponent()

      const input = screen.getByPlaceholderText('Username')
      expect(input).toBeInTheDocument()
    })

    test('should handle field value changes', async () => {
      renderComponent()

      const input = screen.getByPlaceholderText('Username') as HTMLInputElement
      await userEvent.type(input, 'john')

      expect(input.value).toBe('john')
    })

    test('should provide field context to children', () => {
      renderComponent()

      const description = screen.getByText('Enter your username')
      expect(description).toBeInTheDocument()
    })
  })

  describe('FormItem', () => {
    test('should render form item container', () => {
      const TestComponent = () => {
        const form = useForm()
        return (
          <Form form={form} onSubmit={vi.fn()}>
            <FormField
              control={form.control}
              name="test"
              render={() => <FormItem data-testid="form-item">Content</FormItem>}
            />
          </Form>
        )
      }

      render(<TestComponent />)
      expect(screen.getByTestId('form-item')).toBeInTheDocument()
    })

    test('should apply default spacing className', () => {
      const TestComponent = () => {
        const form = useForm()
        return (
          <Form form={form} onSubmit={vi.fn()}>
            <FormField control={form.control} name="test" render={() => <FormItem>Content</FormItem>} />
          </Form>
        )
      }

      const { container } = render(<TestComponent />)
      const item = container.querySelector('.space-y-cn-xs')
      expect(item).toBeInTheDocument()
    })

    test('should apply custom className', () => {
      const TestComponent = () => {
        const form = useForm()
        return (
          <Form form={form} onSubmit={vi.fn()}>
            <FormField
              control={form.control}
              name="test"
              render={() => <FormItem className="custom-item">Content</FormItem>}
            />
          </Form>
        )
      }

      const { container } = render(<TestComponent />)
      const item = container.querySelector('.custom-item')
      expect(item).toBeInTheDocument()
    })

    test('should generate unique id for each item', () => {
      const TestComponent = () => {
        const form = useForm()
        return (
          <Form form={form} onSubmit={vi.fn()}>
            <FormField
              control={form.control}
              name="field1"
              render={() => <FormItem data-testid="item1">Field 1</FormItem>}
            />
            <FormField
              control={form.control}
              name="field2"
              render={() => <FormItem data-testid="item2">Field 2</FormItem>}
            />
          </Form>
        )
      }

      render(<TestComponent />)
      const item1 = screen.getByTestId('item1')
      const item2 = screen.getByTestId('item2')

      expect(item1).toBeInTheDocument()
      expect(item2).toBeInTheDocument()
    })
  })

  describe('FormControl', () => {
    test('should render form control', () => {
      renderComponent()

      const input = screen.getByPlaceholderText('Username')
      expect(input).toBeInTheDocument()
    })

    test('should set aria-invalid when error exists', async () => {
      const TestComponent = () => {
        const form = useForm({
          mode: 'onChange',
          defaultValues: { username: '' }
        })

        return (
          <Form form={form} onSubmit={vi.fn()}>
            <FormField
              control={form.control}
              name="username"
              rules={{ required: 'Required' }}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input {...field} placeholder="Username" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <button
              type="button"
              onClick={() => {
                form.setError('username', { message: 'Required' })
              }}
            >
              Trigger Error
            </button>
          </Form>
        )
      }

      render(<TestComponent />)
      const button = screen.getByRole('button', { name: 'Trigger Error' })
      await userEvent.click(button)

      await waitFor(() => {
        const input = screen.getByPlaceholderText('Username')
        expect(input).toHaveAttribute('aria-invalid', 'true')
      })
    })

    test('should set aria-describedby', () => {
      renderComponent()

      const input = screen.getByPlaceholderText('Username')
      const ariaDescribedby = input.getAttribute('aria-describedby')
      expect(ariaDescribedby).toBeTruthy()
    })
  })

  describe('FormDescription', () => {
    test('should render description text', () => {
      renderComponent()

      const description = screen.getByText('Enter your username')
      expect(description).toBeInTheDocument()
    })

    test('should have correct id attribute', () => {
      renderComponent()

      const description = screen.getByText('Enter your username')
      const id = description.getAttribute('id')
      expect(id).toMatch(/-form-item-description$/)
    })

    test('should render with custom className', () => {
      const TestComponent = () => {
        const form = useForm()
        return (
          <Form form={form} onSubmit={vi.fn()}>
            <FormField
              control={form.control}
              name="test"
              render={() => (
                <FormItem>
                  <FormDescription className="custom-desc">Help text</FormDescription>
                </FormItem>
              )}
            />
          </Form>
        )
      }

      const { container } = render(<TestComponent />)
      const desc = container.querySelector('.custom-desc')
      expect(desc).toBeInTheDocument()
    })
  })

  describe('FormMessage', () => {
    test('should not render when no error', () => {
      renderComponent()

      // FormMessage exists but shows no content when no error
      const errorMessages = screen.queryAllByText(/required/i)
      expect(errorMessages.length).toBe(0)
    })

    test('should render error message', async () => {
      const TestComponent = () => {
        const form = useForm({
          defaultValues: { username: '' }
        })

        return (
          <Form form={form} onSubmit={vi.fn()}>
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <button
              type="button"
              onClick={() => {
                form.setError('username', { message: 'Username is required' })
              }}
            >
              Set Error
            </button>
          </Form>
        )
      }

      render(<TestComponent />)
      const button = screen.getByRole('button', { name: 'Set Error' })
      await userEvent.click(button)

      await waitFor(() => {
        expect(screen.getByText('Username is required')).toBeInTheDocument()
      })
    })

    test('should render custom children when provided', () => {
      const TestComponent = () => {
        const form = useForm()
        return (
          <Form form={form} onSubmit={vi.fn()}>
            <FormField
              control={form.control}
              name="test"
              render={() => (
                <FormItem>
                  <FormMessage>Custom message</FormMessage>
                </FormItem>
              )}
            />
          </Form>
        )
      }

      render(<TestComponent />)
      expect(screen.getByText('Custom message')).toBeInTheDocument()
    })

    test('should have correct id attribute', async () => {
      const TestComponent = () => {
        const form = useForm()

        return (
          <Form form={form} onSubmit={vi.fn()}>
            <FormField
              control={form.control}
              name="test"
              render={() => (
                <FormItem>
                  <FormMessage />
                </FormItem>
              )}
            />
            <button
              type="button"
              onClick={() => {
                form.setError('test', { message: 'Error' })
              }}
            >
              Set Error
            </button>
          </Form>
        )
      }

      render(<TestComponent />)
      const button = screen.getByRole('button', { name: 'Set Error' })
      await userEvent.click(button)

      await waitFor(() => {
        const message = screen.getByText('Error')
        const id = message.getAttribute('id')
        expect(id).toMatch(/-form-item-message$/)
      })
    })
  })

  describe('useFormField Hook', () => {
    test('should provide field data', () => {
      const TestFieldInfo = () => {
        const fieldData = useFormField()
        return <div data-testid="field-name">{fieldData.name}</div>
      }

      const TestComponent = () => {
        const form = useForm()
        return (
          <Form form={form} onSubmit={vi.fn()}>
            <FormField
              control={form.control}
              name="testField"
              render={() => (
                <FormItem>
                  <TestFieldInfo />
                </FormItem>
              )}
            />
          </Form>
        )
      }

      render(<TestComponent />)
      expect(screen.getByTestId('field-name')).toHaveTextContent('testField')
    })

    test('should have field state information', () => {
      const TestFieldInfo = () => {
        const fieldData = useFormField()
        return (
          <div>
            <div data-testid="field-id">{fieldData.id}</div>
            <div data-testid="field-form-item-id">{fieldData.formItemId}</div>
          </div>
        )
      }

      const TestComponent = () => {
        const form = useForm()
        return (
          <Form form={form} onSubmit={vi.fn()}>
            <FormField
              control={form.control}
              name="testField"
              render={() => (
                <FormItem>
                  <TestFieldInfo />
                </FormItem>
              )}
            />
          </Form>
        )
      }

      render(<TestComponent />)
      expect(screen.getByTestId('field-id')).toBeInTheDocument()
      expect(screen.getByTestId('field-form-item-id')).toBeInTheDocument()
    })
  })

  describe('Complex Form Integration', () => {
    test('should handle multiple fields', async () => {
      const handleSubmit = vi.fn()
      const TestComponent = () => {
        const form = useForm({
          defaultValues: {
            username: '',
            email: ''
          }
        })

        return (
          <Form form={form} onSubmit={handleSubmit}>
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input {...field} placeholder="Username" />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input {...field} placeholder="Email" />
                  </FormControl>
                </FormItem>
              )}
            />
            <button type="submit">Submit</button>
          </Form>
        )
      }

      render(<TestComponent />)

      const usernameInput = screen.getByPlaceholderText('Username')
      const emailInput = screen.getByPlaceholderText('Email')

      await userEvent.type(usernameInput, 'john')
      await userEvent.type(emailInput, 'john@example.com')

      const submitButton = screen.getByRole('button', { name: 'Submit' })
      await userEvent.click(submitButton)

      await waitFor(() => {
        expect(handleSubmit).toHaveBeenCalledWith(
          {
            username: 'john',
            email: 'john@example.com'
          },
          expect.anything()
        )
      })
    })

    test('should display multiple error messages', async () => {
      const TestComponent = () => {
        const form = useForm({
          defaultValues: {
            username: '',
            email: ''
          }
        })

        return (
          <Form form={form} onSubmit={vi.fn()}>
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <button
              type="button"
              onClick={() => {
                form.setError('username', { message: 'Username required' })
                form.setError('email', { message: 'Email required' })
              }}
            >
              Set Errors
            </button>
          </Form>
        )
      }

      render(<TestComponent />)
      const button = screen.getByRole('button', { name: 'Set Errors' })
      await userEvent.click(button)

      await waitFor(() => {
        expect(screen.getByText('Username required')).toBeInTheDocument()
        expect(screen.getByText('Email required')).toBeInTheDocument()
      })
    })
  })

  describe('Ref Forwarding', () => {
    test('should forward ref on FormItem', () => {
      const ref = vi.fn()
      const TestComponent = () => {
        const form = useForm()
        return (
          <Form form={form} onSubmit={vi.fn()}>
            <FormField control={form.control} name="test" render={() => <FormItem ref={ref}>Content</FormItem>} />
          </Form>
        )
      }

      render(<TestComponent />)
      expect(ref).toHaveBeenCalled()
    })

    test('should forward ref on FormControl', () => {
      const ref = vi.fn()
      const TestComponent = () => {
        const form = useForm()
        return (
          <Form form={form} onSubmit={vi.fn()}>
            <FormField
              control={form.control}
              name="test"
              render={() => (
                <FormItem>
                  <FormControl ref={ref}>
                    <Input />
                  </FormControl>
                </FormItem>
              )}
            />
          </Form>
        )
      }

      render(<TestComponent />)
      expect(ref).toHaveBeenCalled()
    })
  })
})
