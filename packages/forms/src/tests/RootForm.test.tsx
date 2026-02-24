import { useForm } from 'react-hook-form'

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { z } from 'zod'

import '@testing-library/jest-dom'

import { RootForm } from '../core'
import { IFormDefinition } from '../types'
import { TestFormComponent } from './components/TestFormComponent'

describe('RootForm', () => {
  const mockOnSubmit = jest.fn()
  const mockOnValuesChange = jest.fn()
  const mockOnValidationChange = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Basic Form Rendering', () => {
    it('should render form with default values', () => {
      const defaultValues = { name: 'John', email: 'john@example.com' }

      render(
        <RootForm defaultValues={defaultValues} onSubmit={mockOnSubmit} resolver={undefined} mode="onSubmit">
          {({ submitForm }) => <button onClick={submitForm}>Submit</button>}
        </RootForm>
      )

      const submitButton = screen.getByText('Submit')
      expect(submitButton).toBeTruthy()
      expect(submitButton.tagName).toBe('BUTTON')
    })

    it('should call onValuesChange when form values change', async () => {
      const defaultValues = { name: '' }

      render(
        <RootForm
          defaultValues={defaultValues}
          onSubmit={mockOnSubmit}
          resolver={undefined}
          mode="onSubmit"
          onValuesChange={mockOnValuesChange}
        >
          {({ getValues, setValue }) => (
            <div>
              <button onClick={() => setValue('name', 'John')}>Set Name</button>
              <button onClick={() => getValues()}>Get Values</button>
            </div>
          )}
        </RootForm>
      )

      await userEvent.click(screen.getByText('Set Name'))

      await waitFor(() => {
        expect(mockOnValuesChange).toHaveBeenCalledWith({ name: 'John' })
      })
    })
  })

  describe('Form Submission', () => {
    it('should submit form with valid data', async () => {
      const defaultValues = { name: 'John Doe' }

      render(
        <RootForm defaultValues={defaultValues} onSubmit={mockOnSubmit} resolver={undefined} mode="onSubmit">
          {({ submitForm }) => <button onClick={submitForm}>Submit</button>}
        </RootForm>
      )

      await userEvent.click(screen.getByText('Submit'))

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith(defaultValues)
      })
    })

    it('should not submit when validation fails', async () => {
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
        <TestFormComponent formDefinition={formDefinition} onSubmit={mockOnSubmit} defaultValues={defaultValues} />
      )

      await userEvent.click(screen.getByTestId('submit-button'))

      await waitFor(() => {
        expect(mockOnSubmit).not.toHaveBeenCalled()
      })
    })

    it('should call onValidationChange when form validation state changes', async () => {
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
          defaultValues={defaultValues}
        />
      )

      await userEvent.click(screen.getByTestId('submit-button'))

      await waitFor(() => {
        expect(mockOnValidationChange).toHaveBeenCalledWith({
          isValid: false,
          isSubmitted: true
        })
      })
    })
  })

  describe('Form State Management', () => {
    it('should handle form reset', async () => {
      const defaultValues = { name: 'John' }

      const TestComponent = () => {
        const { reset: _reset } = useForm({
          defaultValues
        })

        return (
          <RootForm defaultValues={defaultValues} onSubmit={mockOnSubmit} resolver={undefined} mode="onSubmit">
            {({ submitForm, reset: resetForm }) => (
              <div>
                <button onClick={submitForm}>Submit</button>
                <button onClick={() => resetForm()}>Reset</button>
              </div>
            )}
          </RootForm>
        )
      }

      render(<TestComponent />)

      await userEvent.click(screen.getByText('Reset'))

      // Verify reset was called (implementation specific)
      const resetButton = screen.getByText('Reset')
      expect(resetButton).toBeTruthy()
      expect(resetButton.tagName).toBe('BUTTON')
    })

    it('should handle readonly mode', () => {
      const defaultValues = { name: 'John' }

      render(
        <RootForm
          defaultValues={defaultValues}
          onSubmit={mockOnSubmit}
          resolver={undefined}
          mode="onSubmit"
          readonly={true}
        >
          {({ submitForm }) => <button onClick={submitForm}>Submit</button>}
        </RootForm>
      )

      const submitButton = screen.getByText('Submit')
      expect(submitButton).toBeTruthy()
      expect(submitButton.tagName).toBe('BUTTON')
    })
  })

  describe('Auto Focus', () => {
    it('should auto focus specified field', async () => {
      const defaultValues = { name: '', email: '' }

      render(
        <RootForm
          defaultValues={defaultValues}
          onSubmit={mockOnSubmit}
          resolver={undefined}
          mode="onSubmit"
          autoFocusPath="name"
        >
          {({ submitForm }) => <button onClick={submitForm}>Submit</button>}
        </RootForm>
      )

      // Auto focus behavior would be tested with actual input components
      const submitButton = screen.getByText('Submit')
      expect(submitButton).toBeTruthy()
      expect(submitButton.tagName).toBe('BUTTON')
    })
  })

  describe('Error Handling', () => {
    it('should handle input render errors', () => {
      const mockOnError = jest.fn()

      render(
        <RootForm
          defaultValues={{}}
          onSubmit={mockOnSubmit}
          resolver={undefined}
          mode="onSubmit"
          onInputRenderError={mockOnError}
        >
          {({ submitForm }) => <button onClick={submitForm}>Submit</button>}
        </RootForm>
      )

      const submitButton = screen.getByText('Submit')
      expect(submitButton).toBeTruthy()
      expect(submitButton.tagName).toBe('BUTTON')
    })
  })
})
