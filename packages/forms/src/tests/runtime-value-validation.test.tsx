import * as React from 'react'

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { z } from 'zod'

import '@testing-library/jest-dom'

import type { IFormDefinition } from '../types'
import { TestFormComponent } from './components/TestFormComponent'

const arrayFormDefinition: IFormDefinition = {
  inputs: [
    {
      inputType: 'array',
      path: 'manifests',
      label: 'Manifest Path',
      required: true,
      inputConfig: {
        input: {
          inputType: 'text',
          path: '',
          label: 'Manifest',
          validation: {
            schema: z.string().min(2, 'Manifest must be at least 2 characters')
          }
        }
      }
    }
  ]
}

describe('Runtime value validation (no globalValidation configured)', () => {
  const mockOnSubmit = jest.fn()
  const mockOnValidationChange = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it.each([
    '<+input>',
    '<+inputs.manifestPath>',
    '${{inputs.manifestPath}}',
    '${{ inputs.manifestPath }}',
    '${{runtime.manifestPath}}',
    '  <+input>  '
  ])('accepts %s on an array input', async value => {
    render(
      <TestFormComponent
        formDefinition={arrayFormDefinition}
        onSubmit={mockOnSubmit}
        onValidationChange={mockOnValidationChange}
        mode="onSubmit"
        defaultValues={{ manifests: value }}
      />
    )

    await userEvent.click(screen.getByTestId('submit-button'))

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({ manifests: value })
    })
    expect(mockOnValidationChange).toHaveBeenCalledWith(expect.objectContaining({ isValid: true }))
  })

  it('still rejects a plain string on an array input', async () => {
    render(
      <TestFormComponent
        formDefinition={arrayFormDefinition}
        onSubmit={mockOnSubmit}
        onValidationChange={mockOnValidationChange}
        mode="onSubmit"
        defaultValues={{ manifests: 'deployment.yaml' }}
      />
    )

    await userEvent.click(screen.getByTestId('submit-button'))

    await waitFor(() => {
      expect(mockOnValidationChange).toHaveBeenCalledWith(expect.objectContaining({ isValid: false }))
    })
    expect(mockOnSubmit).not.toHaveBeenCalled()
  })

  it.each(['<+invalid', '${{broken'])('still rejects malformed expression %s on an array input', async value => {
    render(
      <TestFormComponent
        formDefinition={arrayFormDefinition}
        onSubmit={mockOnSubmit}
        onValidationChange={mockOnValidationChange}
        mode="onSubmit"
        defaultValues={{ manifests: value }}
      />
    )

    await userEvent.click(screen.getByTestId('submit-button'))

    await waitFor(() => {
      expect(mockOnValidationChange).toHaveBeenCalledWith(expect.objectContaining({ isValid: false }))
    })
    expect(mockOnSubmit).not.toHaveBeenCalled()
  })

  it('accepts a runtime value on a list input', async () => {
    const formDefinition: IFormDefinition = {
      inputs: [
        {
          inputType: 'list',
          path: 'flags',
          label: 'Command Flags',
          required: true,
          inputConfig: {
            inputs: [
              { inputType: 'text', relativePath: 'command', label: 'Command Type', required: true },
              { inputType: 'text', relativePath: 'flag', label: 'Flag', required: true }
            ]
          }
        }
      ]
    }

    render(
      <TestFormComponent
        formDefinition={formDefinition}
        onSubmit={mockOnSubmit}
        onValidationChange={mockOnValidationChange}
        mode="onSubmit"
        defaultValues={{ flags: '<+input>' }}
      />
    )

    await userEvent.click(screen.getByTestId('submit-button'))

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({ flags: '<+input>' })
    })
  })

  it('accepts a runtime value on a primitive input with a pattern schema', async () => {
    const formDefinition: IFormDefinition = {
      inputs: [
        {
          inputType: 'text',
          path: 'applyTimeout',
          label: 'Apply Command Timeout',
          required: true,
          validation: {
            schema: z
              .any()
              .optional()
              .refine((value: any) => /^\d+[smh]$/.test(value ?? ''), 'Value does not match pattern')
          }
        }
      ]
    }

    render(
      <TestFormComponent
        formDefinition={formDefinition}
        onSubmit={mockOnSubmit}
        onValidationChange={mockOnValidationChange}
        mode="onSubmit"
        defaultValues={{ applyTimeout: '<+input>' }}
      />
    )

    await userEvent.click(screen.getByTestId('submit-button'))

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({ applyTimeout: '<+input>' })
    })
  })

  it('accepts a non-input expression on a primitive input with a pattern schema', async () => {
    const formDefinition: IFormDefinition = {
      inputs: [
        {
          inputType: 'text',
          path: 'applyTimeout',
          label: 'Apply Command Timeout',
          required: true,
          validation: {
            schema: z
              .any()
              .optional()
              .refine((value: any) => /^\d+[smh]$/.test(value ?? ''), 'Value does not match pattern')
          }
        }
      ]
    }

    render(
      <TestFormComponent
        formDefinition={formDefinition}
        onSubmit={mockOnSubmit}
        onValidationChange={mockOnValidationChange}
        mode="onSubmit"
        defaultValues={{ applyTimeout: '<+pipeline.name>' }}
      />
    )

    await userEvent.click(screen.getByTestId('submit-button'))

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({ applyTimeout: '<+pipeline.name>' })
    })
  })

  it('validates runtime values when skipValidationFor is disabled', async () => {
    render(
      <TestFormComponent
        formDefinition={arrayFormDefinition}
        onSubmit={mockOnSubmit}
        onValidationChange={mockOnValidationChange}
        mode="onSubmit"
        defaultValues={{ manifests: '<+input>' }}
        validationConfig={{ validationConfig: { skipValidationFor: () => false } }}
      />
    )

    await userEvent.click(screen.getByTestId('submit-button'))

    await waitFor(() => {
      expect(mockOnValidationChange).toHaveBeenCalledWith(expect.objectContaining({ isValid: false }))
    })
    expect(mockOnSubmit).not.toHaveBeenCalled()
  })
})
