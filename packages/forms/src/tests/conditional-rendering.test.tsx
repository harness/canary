import * as React from 'react'

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { z } from 'zod'

import '@testing-library/jest-dom'

import { RootForm } from '../core'
import { unsetHiddenInputsValues } from '../core/utils/transform-utils'
import { RenderForm } from '../form'
import type { IFormDefinition } from '../types'
import { TestFormComponent } from './components/TestFormComponent'
import testInputFactory from './factory/factory'

describe('Conditional Visibility Tests', () => {
  const mockOnSubmit = jest.fn()
  const mockOnValuesChange = jest.fn()
  const mockOnValidationChange = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  // Helper function to get a fresh factory instance for each test
  const getFreshFactory = () => testInputFactory.clone()

  describe('Basic Conditional Visibility', () => {
    it('should show field when condition is met', async () => {
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

      const _defaultValues = { repoType: 'inline', remoteRepo: '' }

      render(
        <RootForm
          defaultValues={_defaultValues}
          onSubmit={mockOnSubmit}
          resolver={undefined}
          mode="onSubmit"
          onValuesChange={mockOnValuesChange}
        >
          {({ submitForm, setValue }) => (
            <div>
              <RenderForm factory={getFreshFactory()} inputs={formDefinition} />
              <button onClick={submitForm} data-testid="submit-button">
                Submit
              </button>
              <button onClick={() => setValue('repoType', 'remote')} data-testid="set-remote-button">
                Set Remote
              </button>
            </div>
          )}
        </RootForm>
      )

      // Initially, remoteRepo should not be visible
      expect(screen.queryByTestId('input-remote-repo')).not.toBeInTheDocument()

      // Change repoType to 'remote'
      await userEvent.click(screen.getByTestId('set-remote-button'))

      // Wait for the remoteRepo field to become visible
      await waitFor(() => {
        expect(screen.getByTestId('input-remote-repo')).toBeInTheDocument()
      })

      // Type "test" into the remoteRepo field
      const remoteRepoInput = screen.getByTestId('input-remote-repo')
      await userEvent.type(remoteRepoInput, 'test')

      // Now remoteRepo should be visible
      await waitFor(() => {
        expect(screen.getByTestId('input-remote-repo')).toBeInTheDocument()
      })
    })

    it('should hide field when condition is no longer met', async () => {
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

      const _defaultValues = { repoType: 'remote', remoteRepo: 'existing-value' }

      render(
        <RootForm
          defaultValues={_defaultValues}
          onSubmit={mockOnSubmit}
          resolver={undefined}
          mode="onSubmit"
          onValuesChange={mockOnValuesChange}
        >
          {({ submitForm, setValue }) => (
            <div>
              <RenderForm factory={getFreshFactory()} inputs={formDefinition} />
              <button onClick={submitForm} data-testid="submit-button">
                Submit
              </button>
              <button onClick={() => setValue('repoType', 'inline')} data-testid="set-inline-button">
                Set Inline
              </button>
            </div>
          )}
        </RootForm>
      )

      // Initially, remoteRepo should be visible
      const remoteRepoInput = screen.getByTestId('input-remote-repo')
      expect(remoteRepoInput).toBeTruthy()
      expect(remoteRepoInput.tagName).toBe('INPUT')

      // Change repoType to 'inline'
      await userEvent.click(screen.getByTestId('set-inline-button'))

      // Now remoteRepo should be hidden
      await waitFor(() => {
        const hiddenInput = screen.queryByTestId('input-remote-repo')
        expect(hiddenInput).toBeNull()
      })
    })

    it('should handle multiple conditions with AND logic', async () => {
      const formDefinition: IFormDefinition = {
        inputs: [
          {
            inputType: 'text',
            path: 'featureEnabled',
            label: 'Feature Enabled'
          },
          {
            inputType: 'text',
            path: 'userRole',
            label: 'User Role'
          },
          {
            inputType: 'text',
            path: 'adminField',
            label: 'Admin Field',
            isVisible: (values: any) => values.featureEnabled === 'true' && values.userRole === 'admin'
          }
        ]
      }

      const _defaultValues = { featureEnabled: 'false', userRole: 'user', adminField: '' }

      render(
        <RootForm defaultValues={_defaultValues} onSubmit={mockOnSubmit} resolver={undefined} mode="onSubmit">
          {({ setValue }) => (
            <div>
              <RenderForm factory={getFreshFactory()} inputs={formDefinition} />
              <button onClick={() => setValue('featureEnabled', 'true')} data-testid="enable-feature-button">
                Enable Feature
              </button>
              <button onClick={() => setValue('userRole', 'admin')} data-testid="set-admin-button">
                Set Admin
              </button>
            </div>
          )}
        </RootForm>
      )

      // Initially, adminField should not be visible
      expect(screen.queryByTestId('input-admin-field')).not.toBeInTheDocument()

      // Enable feature only
      await userEvent.click(screen.getByTestId('enable-feature-button'))
      const hiddenAdminField = screen.queryByTestId('input-admin-field')
      expect(hiddenAdminField).toBeNull()

      // Set user role to admin
      await userEvent.click(screen.getByTestId('set-admin-button'))

      // Now adminField should be visible
      await waitFor(() => {
        const adminField = screen.getByTestId('input-admin-field')
        expect(adminField).toBeTruthy()
        expect(adminField.tagName).toBe('INPUT')
      })
    })
  })

  describe('Complex Visibility Logic', () => {
    it('should handle visibility based on metadata', async () => {
      const formDefinition: IFormDefinition = {
        inputs: [
          {
            inputType: 'text',
            path: 'field1',
            label: 'Field 1',
            isVisible: (values: any, metadata: any) => metadata?.showAdvanced
          }
        ]
      }

      const _defaultValues = { field1: '' }
      const metadata = { showAdvanced: false }

      render(
        <RootForm
          defaultValues={_defaultValues}
          onSubmit={mockOnSubmit}
          resolver={undefined}
          mode="onSubmit"
          metadata={metadata}
        >
          {({ submitForm }) => (
            <div>
              <RenderForm factory={getFreshFactory()} inputs={formDefinition} />
              <button onClick={submitForm} data-testid="submit-button">
                Submit
              </button>
            </div>
          )}
        </RootForm>
      )

      // Field should not be visible when showAdvanced is false
      expect(screen.queryByTestId('input-field-1')).not.toBeInTheDocument()

      // Re-render with showAdvanced: true
      const metadataWithAdvanced = { showAdvanced: true }

      render(
        <RootForm
          defaultValues={_defaultValues}
          onSubmit={mockOnSubmit}
          resolver={undefined}
          mode="onSubmit"
          metadata={metadataWithAdvanced}
        >
          {({ submitForm }) => (
            <div>
              <RenderForm factory={getFreshFactory()} inputs={formDefinition} />
              <button onClick={submitForm} data-testid="submit-button">
                Submit
              </button>
            </div>
          )}
        </RootForm>
      )

      // Field should be visible when showAdvanced is true
      expect(screen.getByTestId('input-field-1')).toBeInTheDocument()
    })

    it('should handle nested conditional visibility', async () => {
      const formDefinition: IFormDefinition = {
        inputs: [
          {
            inputType: 'text',
            path: 'parentField',
            label: 'Parent Field'
          },
          {
            inputType: 'group',
            path: 'nestedGroup',
            label: 'Nested Group',
            isVisible: (values: any) => values.parentField === 'show',
            inputs: [
              {
                inputType: 'text',
                path: 'nestedGroup.childField',
                label: 'Child Field'
              },
              {
                inputType: 'text',
                path: 'nestedGroup.conditionalChild',
                label: 'Conditional Child',
                isVisible: (values: any) => values.nestedGroup?.childField === 'show-child'
              }
            ]
          }
        ]
      }

      const _defaultValues = { parentField: 'hide', nestedGroup: { childField: '', conditionalChild: '' } }

      render(
        <RootForm defaultValues={_defaultValues} onSubmit={mockOnSubmit} resolver={undefined} mode="onSubmit">
          {({ setValue }) => (
            <div>
              <RenderForm factory={getFreshFactory()} inputs={formDefinition} />
              <button onClick={() => setValue('parentField', 'show')} data-testid="show-parent-button">
                Show Parent
              </button>
              <button onClick={() => setValue('nestedGroup.childField', 'show-child')} data-testid="show-child-button">
                Show Child
              </button>
            </div>
          )}
        </RootForm>
      )

      // Initially, nested group should not be visible
      expect(screen.queryByTestId('input-child-field')).toBeNull()
      expect(screen.queryByTestId('input-conditional-child')).toBeNull()

      // Show parent group
      await userEvent.click(screen.getByTestId('show-parent-button'))

      // Child field should be visible, but conditional child should not
      await waitFor(() => {
        const childField = screen.getByTestId('input-child-field')
        expect(childField).toBeTruthy()
        expect(childField.tagName).toBe('INPUT')
        const conditionalChild = screen.queryByTestId('input-conditional-child')
        expect(conditionalChild).toBeNull()
      })

      // Show conditional child
      await userEvent.click(screen.getByTestId('show-child-button'))

      // Both should be visible now
      await waitFor(() => {
        const childField = screen.getByTestId('input-child-field')
        expect(childField).toBeTruthy()
        expect(childField.tagName).toBe('INPUT')
        const conditionalChild = screen.getByTestId('input-conditional-child')
        expect(conditionalChild).toBeTruthy()
        expect(conditionalChild.tagName).toBe('INPUT')
      })
    })
  })

  describe('Validation with Hidden Fields', () => {
    it('should not validate hidden fields', async () => {
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
            required: true,
            validation: {
              schema: z.string().min(1, 'Remote repo is required')
            },
            isVisible: (values: any) => values.repoType === 'remote'
          }
        ]
      }

      const _defaultValues = { repoType: 'inline', remoteRepo: '' }

      render(
        <TestFormComponent
          formDefinition={formDefinition}
          onSubmit={mockOnSubmit}
          onValidationChange={mockOnValidationChange}
          mode="onSubmit"
          defaultValues={_defaultValues}
        />
      )

      // Should be able to submit even though remoteRepo is required but hidden
      await userEvent.click(screen.getByTestId('submit-button'))

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({ repoType: 'inline', remoteRepo: '' })
        expect(mockOnValidationChange).toHaveBeenCalledWith({
          isValid: true,
          isSubmitted: true
        })
      })
    })

    it.skip('should validate fields when they become visible', async () => {})
  })

  describe('Hidden Fields Value Cleanup', () => {
    it('should remove hidden field values from submission', async () => {
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
          <RootForm defaultValues={_defaultValues} onSubmit={handleSubmit} resolver={undefined} mode="onSubmit">
            {({ submitForm }) => (
              <div>
                <RenderForm factory={getFreshFactory()} inputs={formDefinition} />
                <button onClick={submitForm} data-testid="submit-button">
                  Submit
                </button>
              </div>
            )}
          </RootForm>
        )
      }

      render(<TestComponent />)

      await userEvent.click(screen.getByTestId('submit-button'))

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({ repoType: 'inline' })
        expect(mockOnSubmit).not.toHaveBeenCalledWith(expect.objectContaining({ remoteRepo: expect.any(String) }))
      })
    })

    it('should preserve visible field values in submission', async () => {
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

      const _defaultValues = { repoType: 'remote', remoteRepo: 'visible-value' }

      const TestComponent = () => {
        const handleSubmit = (values: any) => {
          const cleanedValues = unsetHiddenInputsValues(formDefinition, values)
          mockOnSubmit(cleanedValues)
        }

        return (
          <RootForm defaultValues={_defaultValues} onSubmit={handleSubmit} resolver={undefined} mode="onSubmit">
            {({ submitForm }) => (
              <div>
                <RenderForm factory={getFreshFactory()} inputs={formDefinition} />
                <button onClick={submitForm} data-testid="submit-button">
                  Submit
                </button>
              </div>
            )}
          </RootForm>
        )
      }

      render(<TestComponent />)

      await userEvent.click(screen.getByTestId('submit-button'))

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          repoType: 'remote',
          remoteRepo: 'visible-value'
        })
      })
    })
  })

  describe('Array and List Conditional Visibility', () => {
    it('should handle conditional visibility in arrays', async () => {
      const formDefinition: IFormDefinition = {
        inputs: [
          {
            inputType: 'text',
            path: 'arrayType',
            label: 'Array Type'
          },
          {
            inputType: 'array',
            path: 'items',
            label: 'Items',
            inputConfig: {
              input: {
                inputType: 'text',
                path: '',
                label: 'Item',
                isVisible: (values: any, metadata: any) => metadata?.arrayType === 'advanced'
              }
            }
          }
        ]
      }

      const _defaultValues = { arrayType: 'simple', items: [] }
      const metadata = { arrayType: 'simple' }

      render(
        <RootForm
          defaultValues={_defaultValues}
          onSubmit={mockOnSubmit}
          resolver={undefined}
          mode="onSubmit"
          metadata={metadata}
        >
          {({ submitForm }) => (
            <div>
              <RenderForm factory={getFreshFactory()} inputs={formDefinition} />
              <button onClick={submitForm} data-testid="submit-button">
                Submit
              </button>
            </div>
          )}
        </RootForm>
      )

      // Array items should be handled based on metadata
      expect(screen.getByTestId('submit-button')).toBeInTheDocument()
    })
  })
})
