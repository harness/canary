import * as React from 'react'

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { z } from 'zod'

import '@testing-library/jest-dom'

import { RootForm } from '../core'
import { RenderForm } from '../form'
import type { IFormDefinition } from '../types'
import { TestFormComponent } from './components/TestFormComponent'
import inputComponentFactory from './factory/factory'

describe('Validation Workflows Tests', () => {
  const mockOnSubmit = jest.fn()
  const _mockOnValuesChange = jest.fn()
  const mockOnValidationChange = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Error Removal on Fix', () => {
    it('should clear errors when user fixes invalid input in real-time', async () => {
      const formDefinition: IFormDefinition = {
        inputs: [
          {
            inputType: 'text',
            path: 'email',
            label: 'Email',
            validation: {
              schema: z.string().email('Invalid email format')
            }
          }
        ]
      }

      const defaultValues = { email: '' }

      render(
        <TestFormComponent
          formDefinition={formDefinition}
          onSubmit={mockOnSubmit}
          onValidationChange={mockOnValidationChange}
          mode="onSubmit"
          defaultValues={defaultValues}
        />
      )

      // Enter invalid email
      await userEvent.type(screen.getByTestId('input-email'), 'invalid-email')

      // Submit to trigger validation
      await userEvent.click(screen.getByTestId('submit-button'))

      await waitFor(() => {
        expect(mockOnValidationChange).toHaveBeenCalledWith(expect.objectContaining({ isValid: false }))
      })

      jest.clearAllMocks()

      // Clear and enter valid email
      await userEvent.clear(screen.getByTestId('input-email'))
      await userEvent.type(screen.getByTestId('input-email'), 'valid@example.com')

      await waitFor(() => {
        expect(mockOnValidationChange).toHaveBeenCalledWith(expect.objectContaining({ isValid: true }))
      })
    })

    // TODO: fix
    it('should handle multiple error corrections', async () => {
      const formDefinition: IFormDefinition = {
        inputs: [
          {
            inputType: 'text',
            path: 'name',
            label: 'Name',
            validation: {
              schema: z.string().min(3, 'Name must be at least 3 characters')
            }
          },
          {
            inputType: 'text',
            path: 'age',
            label: 'Age',
            validation: {
              schema: z
                .string()
                .transform(val => Number(val))
                .refine(val => !isNaN(val) && val >= 18, 'Must be at least 18 years old')
            }
          }
        ]
      }

      const defaultValues = { name: '', age: '' }

      render(
        <TestFormComponent
          formDefinition={formDefinition}
          onSubmit={mockOnSubmit}
          onValidationChange={mockOnValidationChange}
          mode="onSubmit"
          defaultValues={defaultValues}
        />
      )

      // Enter invalid values for both fields
      await userEvent.type(screen.getByTestId('input-name'), 'Jo')
      await userEvent.type(screen.getByTestId('input-age'), '16')

      await userEvent.click(screen.getByTestId('submit-button'))

      await waitFor(() => {
        expect(mockOnValidationChange).toHaveBeenCalledWith(expect.objectContaining({ isValid: false }))
      })

      jest.clearAllMocks()

      // Fix the name field
      await userEvent.type(screen.getByTestId('input-name'), 'hn')

      // Should still be invalid due to age
      await waitFor(() => {
        expect(mockOnValidationChange).not.toHaveBeenCalled()
      })

      jest.clearAllMocks()

      // Fix the age field
      await userEvent.clear(screen.getByTestId('input-age'))
      await userEvent.type(screen.getByTestId('input-age'), '25')

      await userEvent.click(screen.getByTestId('submit-button'))

      // Now should be valid
      await waitFor(() => {
        expect(mockOnValidationChange).toHaveBeenCalledWith(expect.objectContaining({ isValid: true }))
      })
    })
  })

  describe('Cross-field Validation Workflows', () => {
    it('should handle dependent validation with real-time updates', async () => {
      const formDefinition: IFormDefinition = {
        inputs: [
          {
            inputType: 'text',
            path: 'password',
            label: 'Password',
            validation: {
              schema: z.string().min(6, 'Password must be at least 6 characters')
            }
          },
          {
            inputType: 'text',
            path: 'confirmPassword',
            label: 'Confirm Password',
            validation: {
              schema: (values: any) => z.string().refine(val => val === values.password, 'Passwords must match')
            }
          }
        ]
      }

      const defaultValues = { password: '', confirmPassword: '' }

      render(
        <TestFormComponent
          formDefinition={formDefinition}
          onSubmit={mockOnSubmit}
          onValidationChange={mockOnValidationChange}
          mode="onSubmit"
          defaultValues={defaultValues}
        />
      )

      // Enter password
      await userEvent.type(screen.getByTestId('input-password'), 'secret123')
      await userEvent.type(screen.getByTestId('input-confirm-password'), 'secret123')

      await userEvent.click(screen.getByTestId('submit-button'))

      // Should be valid since confirmPassword is empty
      await waitFor(() => {
        expect(mockOnValidationChange).toHaveBeenCalledWith(expect.objectContaining({ isValid: true }))
      })

      jest.clearAllMocks()

      // Enter mismatching confirm password
      await userEvent.type(screen.getByTestId('input-confirm-password'), 'different')

      await waitFor(() => {
        expect(mockOnValidationChange).toHaveBeenCalledWith(expect.objectContaining({ isValid: false }))
      })

      jest.clearAllMocks()

      // Fix the confirm password to match
      await userEvent.clear(screen.getByTestId('input-confirm-password'))
      await userEvent.type(screen.getByTestId('input-confirm-password'), 'secret123')

      await waitFor(() => {
        expect(mockOnValidationChange).toHaveBeenCalledWith(expect.objectContaining({ isValid: true }))
      })
    })

    it('should handle cross-field validation with dynamic schema function', async () => {
      const formDefinition: IFormDefinition = {
        inputs: [
          {
            inputType: 'text',
            path: 'firstInput',
            label: 'First Input'
          },
          {
            inputType: 'text',
            path: 'secondInput',
            label: 'Second Input',
            validation: {
              schema: (values: any) => {
                const firstValue = values.firstInput || ''
                return z.string().refine(
                  val => {
                    return val.length > firstValue.length
                  },
                  {
                    message: `Second input must be longer than "${firstValue}"`
                  }
                )
              }
            }
          }
        ]
      }

      const defaultValues = { firstInput: '', secondInput: '' }

      render(
        <TestFormComponent
          formDefinition={formDefinition}
          onSubmit={mockOnSubmit}
          onValidationChange={mockOnValidationChange}
          mode="onSubmit"
          defaultValues={defaultValues}
        />
      )

      // Enter short first input
      await userEvent.type(screen.getByTestId('input-first-input'), 'abc')

      // Enter short second input to trigger validation
      await userEvent.type(screen.getByTestId('input-second-input'), 'ab')

      // Submit to trigger validation
      await userEvent.click(screen.getByTestId('submit-button'))

      // Should be invalid since second input (2 chars) is not longer than first (3 chars)
      await waitFor(() => {
        expect(mockOnValidationChange).toHaveBeenCalledWith(expect.objectContaining({ isValid: false }))
      })

      // Check that the error message contains the first input value
      expect(screen.getByText('Second input must be longer than "abc"')).toBeInTheDocument()

      jest.clearAllMocks()

      // Fix by making second input longer
      await userEvent.type(screen.getByTestId('input-second-input'), 'cde')

      // Submit again to trigger validation
      await userEvent.click(screen.getByTestId('submit-button'))

      // Should be valid since second input (5 chars) is longer than first (3 chars)
      await waitFor(() => {
        expect(mockOnValidationChange).toHaveBeenCalledWith(expect.objectContaining({ isValid: true }))
      })

      // Error message should be gone
      expect(screen.queryByText('Second input must be longer than "abc"')).not.toBeInTheDocument()
    })
  })

  describe('Warning Validation', () => {
    it('should show warnings without blocking submission', async () => {
      const formDefinition: IFormDefinition = {
        inputs: [
          {
            inputType: 'text',
            path: 'description',
            label: 'Description',
            warning: {
              schema: z.string().min(10, 'Description is short, consider adding more details')
            }
          }
        ]
      }

      const defaultValues = { description: 'Short' }

      render(
        <RootForm defaultValues={defaultValues} onSubmit={mockOnSubmit} resolver={undefined} mode="onSubmit">
          {({ submitForm }) => (
            <div>
              <RenderForm factory={inputComponentFactory} inputs={formDefinition} />
              <button onClick={submitForm} data-testid="submit-button">
                Submit
              </button>
            </div>
          )}
        </RootForm>
      )

      // Should be able to submit despite warning
      await userEvent.click(screen.getByTestId('submit-button'))

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({ description: 'Short' })
      })
    })

    it('should handle both validation and warning on same field', async () => {
      const formDefinition: IFormDefinition = {
        inputs: [
          {
            inputType: 'text',
            path: 'username',
            label: 'Username',
            required: true,
            validation: {
              schema: z.string().min(3, 'Username must be at least 3 characters')
            },
            warning: {
              schema: z.string().max(10, 'Username is long, consider a shorter name')
            }
          }
        ]
      }

      const defaultValues = { username: '' }

      render(
        <TestFormComponent
          formDefinition={formDefinition}
          onSubmit={mockOnSubmit}
          onValidationChange={mockOnValidationChange}
          mode="onSubmit"
          defaultValues={defaultValues}
        />
      )

      // Enter short username (valid but triggers warning)
      await userEvent.type(screen.getByTestId('input-username'), 'ab')

      // Should be able to submit
      await userEvent.click(screen.getByTestId('submit-button'))

      await waitFor(() => {
        expect(mockOnValidationChange).toHaveBeenCalledWith(
          expect.objectContaining({ isValid: false }) // Still invalid due to min length
        )
      })

      jest.clearAllMocks()

      // Enter valid username (triggers warning but passes validation)
      await userEvent.type(screen.getByTestId('input-username'), 'c')

      await waitFor(() => {
        expect(mockOnValidationChange).toHaveBeenCalledWith(
          expect.objectContaining({ isValid: true }) // Valid despite warning
        )
      })

      // Should be able to submit
      await userEvent.click(screen.getByTestId('submit-button'))

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({ username: 'abc' })
      })
    })

    it('should render warning message when warning is triggered', async () => {
      const formDefinition: IFormDefinition = {
        inputs: [
          {
            inputType: 'text',
            path: 'description',
            label: 'Description',
            warning: {
              schema: z.string().min(10, 'Description is short, consider adding more details')
            }
          }
        ]
      }

      const defaultValues = { description: 'Short' }

      render(
        <TestFormComponent
          formDefinition={formDefinition}
          onSubmit={mockOnSubmit}
          mode="onChange"
          defaultValues={defaultValues}
        />
      )

      // Warning should be rendered
      await waitFor(() => {
        expect(screen.getByTestId('warning-description')).toBeInTheDocument()
        expect(screen.getByTestId('warning-description')).toHaveTextContent(
          'Description is short, consider adding more details'
        )
      })
    })
  })

  describe('Global Validation', () => {
    it.skip('should apply global validation to all inputs', async () => {
      const formDefinition: IFormDefinition = {
        inputs: [
          {
            inputType: 'text',
            path: 'field1',
            label: 'Field 1',
            validation: {
              schema: z.string()
            }
          },
          {
            inputType: 'text',
            path: 'field2',
            label: 'Field 2',
            validation: {
              schema: z.string()
            }
          }
        ]
      }

      const validationConfig = {
        globalValidation: (value: any, input: any) => {
          if (input.path === 'field1' && value === 'forbidden') {
            return { error: 'Field1 cannot be "forbidden"', continue: false }
          }
          return { continue: true }
        }
      }

      const defaultValues = { field1: '', field2: '' }

      render(
        <TestFormComponent
          formDefinition={formDefinition}
          onSubmit={mockOnSubmit}
          onValidationChange={mockOnValidationChange}
          mode="onSubmit"
          defaultValues={defaultValues}
          validationConfig={validationConfig}
        />
      )

      // Enter forbidden value in field1
      await userEvent.type(screen.getByTestId('input-field-1'), 'forbidden')

      // Submit to trigger validation
      await userEvent.click(screen.getByTestId('submit-button'))

      await waitFor(() => {
        expect(mockOnValidationChange).toHaveBeenCalledWith(
          expect.objectContaining({ isSubmitted: true, isValid: false })
        )
      })

      jest.clearAllMocks()

      // Fix field1
      await userEvent.clear(screen.getByTestId('input-field-1'))
      await userEvent.type(screen.getByTestId('input-field-1'), 'allowed')

      await waitFor(() => {
        expect(mockOnValidationChange).toHaveBeenCalledWith(
          expect.objectContaining({ isSubmitted: true, isValid: true })
        )
      })
    })

    it('should handle per-input required messages', async () => {
      const formDefinition: IFormDefinition = {
        inputs: [
          {
            inputType: 'text',
            path: 'name',
            label: 'Name',
            required: true
          },
          {
            inputType: 'text',
            path: 'email',
            label: 'Email',
            required: true
          }
        ]
      }

      const validationConfig = {
        requiredMessagePerInput: {
          text: 'Custom required message for text fields'
        }
      }

      const defaultValues = { name: '', email: '' }

      render(
        <TestFormComponent
          formDefinition={formDefinition}
          onSubmit={mockOnSubmit}
          onValidationChange={mockOnValidationChange}
          mode="onSubmit"
          defaultValues={defaultValues}
          validationConfig={validationConfig}
        />
      )

      await userEvent.click(screen.getByTestId('submit-button'))

      await waitFor(() => {
        expect(mockOnValidationChange).toHaveBeenCalledWith(
          expect.objectContaining({ isValid: false, isSubmitted: true })
        )
      })
    })
  })

  describe('Error State Management', () => {
    it('should track form submission state correctly', async () => {
      const formDefinition: IFormDefinition = {
        inputs: [
          {
            inputType: 'text',
            path: 'name',
            label: 'Name',
            required: true,
            validation: {
              schema: z.string().min(1, 'Name is required')
            }
          }
        ]
      }

      const defaultValues = { name: '' }

      render(
        <TestFormComponent
          formDefinition={formDefinition}
          onSubmit={mockOnSubmit}
          onValidationChange={mockOnValidationChange}
          mode="onSubmit"
          defaultValues={defaultValues}
        />
      )

      // Initial state - not submitted
      expect(mockOnValidationChange).not.toHaveBeenCalled()

      // Submit with error
      await userEvent.click(screen.getByTestId('submit-button'))

      await waitFor(() => {
        expect(mockOnValidationChange).toHaveBeenCalledWith({
          isValid: false,
          isSubmitted: true
        })
      })

      jest.clearAllMocks()

      // Fix the error
      await userEvent.type(screen.getByTestId('input-name'), 'John')

      await waitFor(() => {
        expect(mockOnValidationChange).toHaveBeenCalledWith({
          isValid: true,
          isSubmitted: true // Should remain true after first submission
        })
      })
    })
  })
})
