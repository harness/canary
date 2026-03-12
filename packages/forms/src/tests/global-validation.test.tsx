import * as React from 'react'

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { z } from 'zod'

import '@testing-library/jest-dom'

import type { IFormDefinition } from '../types'
import { TestFormComponent } from './components/TestFormComponent'

describe('Global Validation Tests', () => {
  const mockOnSubmit = jest.fn()
  const mockOnValidationChange = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('List Input Type', () => {
    it('should validate list when value is array of objects', async () => {
      const formDefinition: IFormDefinition = {
        inputs: [
          {
            inputType: 'list',
            path: 'users',
            label: 'Users',
            required: true,
            inputConfig: {
              inputs: [
                {
                  inputType: 'text',
                  relativePath: 'name',
                  label: 'Name',
                  required: true
                },
                {
                  inputType: 'text',
                  relativePath: 'email',
                  label: 'Email',
                  required: true,
                  validation: {
                    schema: z.string().email('Invalid email')
                  }
                }
              ]
            }
          }
        ]
      }

      const defaultValues = {
        users: [
          { name: 'John Doe', email: 'john@example.com' },
          { name: 'Jane Smith', email: 'jane@example.com' }
        ]
      }

      const validationConfig = {
        validationConfig: {
          globalValidation: (value: unknown) => {
            if (typeof value === 'string' && value.indexOf('<+input') !== -1) {
              return { continue: false }
            }
            return { continue: true }
          }
        }
      }

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

      const submitButton = screen.getByTestId('submit-button')
      await userEvent.click(submitButton)

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          users: [
            { name: 'John Doe', email: 'john@example.com' },
            { name: 'Jane Smith', email: 'jane@example.com' }
          ]
        })
      })
    })

    it('should skip validation when list value is runtime input string like <+input>', async () => {
      const formDefinition: IFormDefinition = {
        inputs: [
          {
            inputType: 'list',
            path: 'users',
            label: 'Users',
            required: true,
            inputConfig: {
              inputs: [
                {
                  inputType: 'text',
                  relativePath: 'name',
                  label: 'Name',
                  required: true
                },
                {
                  inputType: 'text',
                  relativePath: 'email',
                  label: 'Email',
                  required: true,
                  validation: {
                    schema: z.string().email('Invalid email')
                  }
                }
              ]
            }
          }
        ]
      }

      // Runtime value - should be intercepted by global validation
      const defaultValues = {
        users: '<+input.userList>'
      }

      const validationConfig = {
        validationConfig: {
          globalValidation: (value: unknown) => {
            if (typeof value === 'string' && value.indexOf('<+input') !== -1) {
              // Skip validation for runtime values
              return { continue: false }
            }
            return { continue: true }
          }
        }
      }

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

      const submitButton = screen.getByTestId('submit-button')
      await userEvent.click(submitButton)

      // Should submit successfully without "Expected array, received string" error
      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          users: '<+input.userList>'
        })
      })

      // Should be valid
      expect(mockOnValidationChange).toHaveBeenCalledWith(
        expect.objectContaining({
          isValid: true
        })
      )
    })
  })

  describe('Array Input Type', () => {
    it('should validate array when value is array of strings', async () => {
      const formDefinition: IFormDefinition = {
        inputs: [
          {
            inputType: 'array',
            path: 'tags',
            label: 'Tags',
            required: true,
            inputConfig: {
              input: {
                inputType: 'text',
                path: '',
                label: 'Tag',
                validation: {
                  schema: z.string().min(2, 'Tag must be at least 2 characters')
                }
              }
            }
          }
        ]
      }

      const defaultValues = {
        tags: ['javascript', 'typescript', 'react']
      }

      const validationConfig = {
        validationConfig: {
          globalValidation: (value: unknown) => {
            if (typeof value === 'string' && value.indexOf('<+input') !== -1) {
              return { continue: false }
            }
            return { continue: true }
          }
        }
      }

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

      const submitButton = screen.getByTestId('submit-button')
      await userEvent.click(submitButton)

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          tags: ['javascript', 'typescript', 'react']
        })
      })
    })

    it('should skip validation when array value is runtime input string like <+input>', async () => {
      const formDefinition: IFormDefinition = {
        inputs: [
          {
            inputType: 'array',
            path: 'tags',
            label: 'Tags',
            required: true,
            inputConfig: {
              input: {
                inputType: 'text',
                path: '',
                label: 'Tag',
                validation: {
                  schema: z.string().min(2, 'Tag must be at least 2 characters')
                }
              }
            }
          }
        ]
      }

      // Runtime value - should be intercepted by global validation
      const defaultValues = {
        tags: '<+input.tagList>'
      }

      const validationConfig = {
        validationConfig: {
          globalValidation: (value: unknown) => {
            if (typeof value === 'string' && value.indexOf('<+input') !== -1) {
              // Skip validation for runtime values
              return { continue: false }
            }
            return { continue: true }
          }
        }
      }

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

      const submitButton = screen.getByTestId('submit-button')
      await userEvent.click(submitButton)

      // Should submit successfully without "Expected array, received string" error
      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          tags: '<+input.tagList>'
        })
      })

      // Should be valid
      expect(mockOnValidationChange).toHaveBeenCalledWith(
        expect.objectContaining({
          isValid: true
        })
      )
    })
  })
})
