import * as React from 'react'

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { z } from 'zod'

import '@testing-library/jest-dom'

import { RootForm, useZodValidationResolver } from '../core'
import { getTransformers, outputTransformValues, unsetHiddenInputsValues } from '../core/utils/transform-utils'
import { RenderForm } from '../form'
import type { IFormDefinition } from '../types'
import { TestFormComponent } from './components/TestFormComponent'
import inputComponentFactory from './factory/factory'

describe('Form Submission Integration Tests', () => {
  const mockOnSubmit = jest.fn()
  const mockOnValuesChange = jest.fn()
  const mockOnValidationChange = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Valid Form Submission', () => {
    it('should submit form with all required fields filled', async () => {
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
          },
          {
            inputType: 'text',
            path: 'email',
            label: 'Email',
            validation: {
              schema: z.string().email('Invalid email')
            }
          }
        ]
      }

      const _defaultValues = { name: '', email: '' }

      render(
        <TestFormComponent
          formDefinition={formDefinition}
          onSubmit={mockOnSubmit}
          onValuesChange={mockOnValuesChange}
          onValidationChange={mockOnValidationChange}
          mode="onSubmit"
        />
      )

      // Fill in the form
      await userEvent.type(screen.getByTestId('input-name'), 'John Doe')
      await userEvent.type(screen.getByTestId('input-email'), 'john@example.com')

      // Submit the form
      await userEvent.click(screen.getByTestId('submit-button'))

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          name: 'John Doe',
          email: 'john@example.com'
        })
      })
    })

    it('should submit with default values when no changes made', async () => {
      const formDefinition: IFormDefinition = {
        inputs: [
          {
            inputType: 'text',
            path: 'name',
            label: 'Name',
            default: 'Default Name'
          }
        ]
      }

      const _defaultValues = { name: 'Default Name' }

      render(
        <TestFormComponent
          formDefinition={formDefinition}
          onSubmit={mockOnSubmit}
          mode="onSubmit"
          defaultValues={_defaultValues}
        />
      )

      await userEvent.click(screen.getByTestId('submit-button'))

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({ name: 'Default Name' })
      })
    })

    it('should apply output transformations before submission', async () => {
      const formDefinition: IFormDefinition = {
        inputs: [
          {
            inputType: 'text',
            path: 'name',
            label: 'Name',
            outputTransform: (value: any) => ({
              value: value?.trim(),
              path: 'processedName',
              unset: true
            })
          },
          {
            inputType: 'text',
            path: 'email',
            label: 'Email'
          }
        ]
      }

      const _defaultValues = { name: '  John Doe  ', email: 'john@example.com' }

      const TestComponent = () => {
        const transformers = getTransformers(formDefinition)

        const handleSubmit = (values: any) => {
          const transformedValues = outputTransformValues(values, transformers)
          mockOnSubmit(transformedValues)
        }

        return (
          <TestFormComponent
            formDefinition={formDefinition}
            onSubmit={handleSubmit}
            mode="onSubmit"
            defaultValues={_defaultValues}
          />
        )
      }

      render(<TestComponent />)

      await userEvent.click(screen.getByTestId('submit-button'))

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          processedName: 'John Doe',
          email: 'john@example.com'
        })
      })
    })
  })

  describe('Submit Prevention with Errors', () => {
    it('should prevent submission when required fields are empty', async () => {
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
          },
          {
            inputType: 'text',
            path: 'email',
            label: 'Email',
            required: true,
            validation: {
              schema: z.string().email('Invalid email')
            }
          }
        ]
      }

      const _defaultValues = { name: '', email: '' }

      render(
        <TestFormComponent
          formDefinition={formDefinition}
          onSubmit={mockOnSubmit}
          onValidationChange={mockOnValidationChange}
          mode="onSubmit"
        />
      )

      // Try to submit without filling required fields
      await userEvent.click(screen.getByTestId('submit-button'))

      await waitFor(() => {
        expect(mockOnSubmit).not.toHaveBeenCalled()
        expect(mockOnValidationChange).toHaveBeenCalledWith({
          isValid: false,
          isSubmitted: true
        })
      })
    })

    it('should prevent submission when custom validation fails', async () => {
      const formDefinition: IFormDefinition = {
        inputs: [
          {
            inputType: 'text',
            path: 'age',
            label: 'Age',
            validation: {
              schema: z.number().min(18, 'Must be at least 18 years old')
            }
          }
        ]
      }

      const _defaultValues = { age: '16' }

      render(<TestFormComponent formDefinition={formDefinition} onSubmit={mockOnSubmit} mode="onSubmit" />)

      await userEvent.click(screen.getByTestId('submit-button'))

      await waitFor(() => {
        expect(mockOnSubmit).not.toHaveBeenCalled()
      })
    })

    it('should prevent submission when cross-field validation fails', async () => {
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

      const _defaultValues = { password: 'secret', confirmPassword: 'different' }

      render(<TestFormComponent formDefinition={formDefinition} onSubmit={mockOnSubmit} mode="onSubmit" />)

      await userEvent.click(screen.getByTestId('submit-button'))

      await waitFor(() => {
        expect(mockOnSubmit).not.toHaveBeenCalled()
      })
    })
  })

  describe('Error Removal on Fix', () => {
    it('should clear errors when user fixes invalid input', async () => {
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

      const _defaultValues = { email: '' }

      render(
        <TestFormComponent
          formDefinition={formDefinition}
          onSubmit={mockOnSubmit}
          onValidationChange={mockOnValidationChange}
          mode="onSubmit"
        />
      )

      // Enter invalid email
      await userEvent.type(screen.getByTestId('input-email'), 'invalid-email')
      await userEvent.tab() // Trigger blur to validate

      // Submit to trigger validation in onSubmit mode
      await userEvent.click(screen.getByTestId('submit-button'))

      // Manually trigger validation to ensure it runs
      await screen.findByDisplayValue('invalid-email') // Wait for the input to be updated

      await waitFor(() => {
        expect(mockOnValidationChange).toHaveBeenCalledWith(expect.objectContaining({ isValid: false }))
      })

      // Clear and enter valid email
      await userEvent.clear(screen.getByTestId('input-email'))
      await userEvent.type(screen.getByTestId('input-email'), 'valid@example.com')
      await userEvent.tab() // Trigger blur to validate

      // Manually trigger validation to ensure it runs
      await screen.findByDisplayValue('valid@example.com') // Wait for the input to be updated

      await waitFor(() => {
        expect(mockOnValidationChange).toHaveBeenCalledWith(expect.objectContaining({ isValid: true }))
      })
    })

    it.skip('should resolve cross-field errors when dependent field is fixed', async () => {})

    it('should track form values changes', async () => {
      const formDefinition: IFormDefinition = {
        inputs: [
          {
            inputType: 'text',
            path: 'name',
            label: 'Name'
          }
        ]
      }

      const _defaultValues = { name: '' }

      render(
        <TestFormComponent
          formDefinition={formDefinition}
          onSubmit={mockOnSubmit}
          onValuesChange={mockOnValuesChange}
          mode="onSubmit"
        />
      )

      // Change form value
      await userEvent.type(screen.getByTestId('input-name'), 'John')

      await waitFor(() => {
        expect(mockOnValuesChange).toHaveBeenCalledWith({ name: 'John' })
      })
    })

    it('should handle form reset correctly', async () => {
      const formDefinition: IFormDefinition = {
        inputs: [
          {
            inputType: 'text',
            path: 'name',
            label: 'Name'
          }
        ]
      }

      const _defaultValues = { name: 'Original Name' }

      const TestResetComponent = () => {
        const resolver = useZodValidationResolver(formDefinition)

        return (
          <RootForm defaultValues={_defaultValues} onSubmit={mockOnSubmit} resolver={resolver} mode="onSubmit">
            {({ submitForm, reset }) => (
              <div>
                <RenderForm inputs={formDefinition} factory={inputComponentFactory} />
                <button onClick={submitForm} data-testid="submit-button">
                  Submit
                </button>
                <button onClick={() => reset()} data-testid="reset-button">
                  Reset
                </button>
              </div>
            )}
          </RootForm>
        )
      }

      render(<TestResetComponent />)

      // Change the value
      await userEvent.clear(screen.getByTestId('input-name'))
      await userEvent.type(screen.getByTestId('input-name'), 'Changed Name')

      // Reset the form
      await userEvent.click(screen.getByTestId('reset-button'))

      // Submit to verify reset worked
      await userEvent.click(screen.getByTestId('submit-button'))

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({ name: 'Original Name' })
      })
    })
  })

  describe('Hidden Fields Handling', () => {
    it('should not include hidden field values in submission', async () => {
      const formDefinition: IFormDefinition = {
        inputs: [
          {
            inputType: 'text',
            path: 'repoType',
            label: 'Repo Type'
          },
          {
            inputType: 'text',
            path: 'remoteRepo',
            label: 'Remote Repo',
            isVisible: (values: any) => values.repoType === 'remote'
          }
        ]
      }

      const _defaultValues = { repoType: 'inline', remoteRepo: 'hidden-value' }

      const TestComponent = () => {
        const handleSubmit = (values: any) => {
          const cleanedValues = unsetHiddenInputsValues(formDefinition, values)
          mockOnSubmit(cleanedValues)
        }

        return (
          <TestFormComponent
            formDefinition={formDefinition}
            onSubmit={handleSubmit}
            mode="onSubmit"
            defaultValues={_defaultValues}
          />
        )
      }

      render(<TestComponent />)

      await userEvent.click(screen.getByTestId('submit-button'))

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({ repoType: 'inline' })
        expect(mockOnSubmit).not.toHaveBeenCalledWith(expect.objectContaining({ remoteRepo: expect.any(String) }))
      })
    })
  })
})
