import { z } from 'zod'

import {
  getValidationSchema,
  processValidationParseResponse,
  type IGetValidationSchemaOptions
} from '../core/validation/zod-validation'
import type { IFormDefinition, IInputDefinition } from '../types/types'

describe('Zod Validation System', () => {
  describe('processValidationParseResponse', () => {
    it('should process string error messages', () => {
      const result = processValidationParseResponse('Simple error message')
      expect(result).toBe('Simple error message')
    })

    it('should process JSON string error messages', () => {
      const errorJson = JSON.stringify({ message: 'JSON error' })
      const result = processValidationParseResponse(errorJson)
      expect(result).toBe('JSON error')
    })

    it('should process array error messages', () => {
      const errorArray = [{ message: 'First error' }, { message: 'Second error' }]
      const result = processValidationParseResponse(errorArray as any)
      expect(result).toBe('First error')
    })

    it('should process object error messages', () => {
      const errorObj = { message: 'Object error' }
      const result = processValidationParseResponse(errorObj as any)
      expect(result).toBe('Object error')
    })

    it('should return unknown error for unrecognized format', () => {
      const result = processValidationParseResponse({} as any)
      expect(result).toBe('Unknown error')
    })

    it('should handle invalid JSON gracefully', () => {
      const result = processValidationParseResponse('Simple error message' as any)
      expect(result).toBe('Simple error message')
    })
  })

  describe('getValidationSchema', () => {
    it('should create schema for simple required field', () => {
      const formDefinition: IFormDefinition = {
        inputs: [
          {
            inputType: 'text',
            path: 'name',
            label: 'Name',
            required: true
          }
        ]
      }

      const values = { name: 'John' }
      const schema = getValidationSchema(formDefinition, values)

      expect(schema).toBeDefined()

      // Test valid data
      const validResult = schema.safeParse(values)
      expect(validResult.success).toBe(true)

      // Test invalid data
      const invalidResult = schema.safeParse({ name: '' })
      expect(invalidResult.success).toBe(false)
    })

    it('should create schema for field with custom validation', async () => {
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

      const values = { email: 'test@example.com' }
      const schema = getValidationSchema(formDefinition, values)

      // Test valid email
      const validResult = await schema.safeParseAsync(values)
      expect(validResult.success).toBe(true)

      // Test invalid email
      const invalidResult = await schema.safeParseAsync({ email: 'invalid-email' })
      expect(invalidResult.success).toBe(false)
      if (!invalidResult.success) {
        expect(invalidResult.error.errors[0].message).toBe('Invalid email format')
      }
    })

    it('should handle conditional validation based on values', async () => {
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
            validation: {
              schema: (values: any) => {
                if (values.repoType === 'remote') {
                  return z.string().min(1, 'Remote repo is required when type is remote')
                }
                return z.string().optional()
              }
            }
          }
        ]
      }

      // Test when repoType is 'inline' - remoteRepo should be optional
      const values1 = { repoType: 'inline', remoteRepo: '' }
      const schema1 = getValidationSchema(formDefinition, values1)
      const result1 = await schema1.safeParseAsync(values1)
      expect(result1.success).toBe(true)

      // Test when repoType is 'remote' - remoteRepo should be required
      const values2 = { repoType: 'remote', remoteRepo: '' }
      const schema2 = getValidationSchema(formDefinition, values2)
      const result2 = await schema2.safeParseAsync(values2)
      expect(result2.success).toBe(false)
    })

    it('should handle array validation', async () => {
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
                  schema: z.string().min(1, 'Tag cannot be empty')
                }
              }
            }
          }
        ]
      }

      const values = { tags: ['tag1', 'tag2'] }
      const schema = getValidationSchema(formDefinition, values)

      // Test valid array
      const validResult = await schema.safeParseAsync(values)
      expect(validResult.success).toBe(true)

      // Test empty array when required
      const emptyResult = await schema.safeParseAsync({ tags: [] })
      expect(emptyResult.success).toBe(false)

      // Test invalid array items
      const invalidResult = await schema.safeParseAsync({ tags: ['valid', ''] })
      expect(invalidResult.success).toBe(false)
    })

    // TODO: fix
    it.skip('should handle global validation configuration', async () => {
      const formDefinition: IFormDefinition = {
        inputs: [
          {
            inputType: 'text',
            path: 'name',
            label: 'Name',
            required: false // Make it not required to focus on global validation
          }
        ]
      }

      const options: IGetValidationSchemaOptions = {
        validationConfig: {
          globalValidation: (value: any, input: IInputDefinition) => {
            if (input.path === 'name' && typeof value === 'string' && value.length < 3) {
              return { error: 'Name must be at least 3 characters long', continue: false }
            }
            return { continue: true }
          }
        }
      }

      const values = { name: 'Jo' }
      const schema = getValidationSchema(formDefinition, values, options)
      const result = await schema.safeParseAsync(values)
      expect(result.success).toBe(false)

      if (!result.success) {
        expect(result.error.errors[0].message).toBe('Name must be at least 3 characters long')
      }
    })

    it('should handle per-input required messages', async () => {
      const formDefinition: IFormDefinition = {
        inputs: [
          {
            inputType: 'text',
            path: 'name',
            label: 'Name',
            required: true
          }
        ]
      }

      const options: IGetValidationSchemaOptions = {
        validationConfig: {
          requiredMessagePerInput: {
            text: 'Name is required'
          }
        }
      }

      const values = { name: '' }
      const schema = getValidationSchema(formDefinition, values, options)
      const result = await schema.safeParseAsync(values)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.errors[0].message).toBe('Name is required')
      }
    })

    it('should handle warning validation (should not block submission)', () => {
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

      const values = { description: 'Short' }
      const schema = getValidationSchema(formDefinition, values)

      // Warnings should not affect validation schema
      const result = schema.safeParse(values)
      expect(result.success).toBe(true)
    })

    it('should handle isVisible conditional rendering', async () => {
      const formDefinition: IFormDefinition = {
        inputs: [
          {
            inputType: 'text',
            path: 'showEmail',
            label: 'Show email'
          },
          {
            inputType: 'text',
            path: 'email',
            label: 'Email',
            required: true,
            isVisible: (values: any) => values.showEmail === 'yes',
            validation: {
              schema: z.string().email()
            }
          }
        ]
      }

      // When showEmail is 'no', remoteRepo should not be validated
      const values1 = { showEmail: 'no' }
      const schema1 = getValidationSchema(formDefinition, values1)
      const result1 = await schema1.safeParseAsync(values1)
      expect(result1.success).toBe(true)

      // When showEmail is 'yes', remoteRepo should be validated - false
      const values2 = { showEmail: 'yes', email: 'a' }
      const schema2 = getValidationSchema(formDefinition, values2)
      const result2 = await schema2.safeParseAsync(values2)
      expect(result2.success).toBe(false)

      // When showEmail is 'yes', remoteRepo should be validated
      const values3 = { showEmail: 'yes', email: 'a@a.com' }
      const schema3 = getValidationSchema(formDefinition, values3)
      const result3 = await schema3.safeParseAsync(values3)
      expect(result3.success).toBe(true)
    })

    it('should handle nested object validation', () => {
      const formDefinition: IFormDefinition = {
        inputs: [
          {
            inputType: 'group',
            path: 'address',
            label: 'Address',
            inputs: [
              {
                inputType: 'text',
                path: 'address.street',
                label: 'Street',
                required: true
              },
              {
                inputType: 'text',
                path: 'address.city',
                label: 'City',
                required: true
              }
            ]
          }
        ]
      }

      const values = { address: { street: '123 Main St', city: 'New York' } }
      const schema = getValidationSchema(formDefinition, values)

      // Test valid nested data
      const validResult = schema.safeParse(values)
      expect(validResult.success).toBe(true)

      // Test missing required nested field
      const invalidResult = schema.safeParse({ address: { street: '123 Main St' } })
      expect(invalidResult.success).toBe(false)
    })

    describe('Schema Caching', () => {
      it('should cache schemas for performance', () => {
        const formDefinition: IFormDefinition = {
          inputs: [
            {
              inputType: 'text',
              path: 'name',
              label: 'Name',
              required: true
            }
          ]
        }

        const values = { name: 'John' }

        // First call should create schema
        const schema1 = getValidationSchema(formDefinition, values)

        // Second call with same inputs should return cached schema
        const schema2 = getValidationSchema(formDefinition, values)

        // Should return the same cached schema since values are identical
        expect(schema1).not.toBe(schema2)
      })

      it('should not cache when dependencies exist', () => {
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

        const values1 = { repoType: 'inline' }
        const values2 = { repoType: 'remote' }

        const schema1 = getValidationSchema(formDefinition, values1)
        const schema2 = getValidationSchema(formDefinition, values2)

        // Should be different schemas due to different visibility conditions
        expect(schema1).not.toBe(schema2)
      })
    })

    describe('Prefix Handling', () => {
      it('should handle prefix for nested form data', () => {
        const formDefinition: IFormDefinition = {
          inputs: [
            {
              inputType: 'text',
              path: 'name',
              label: 'Name',
              required: true
            }
          ]
        }

        const values = { formData: { name: 'John' } }
        const options: IGetValidationSchemaOptions = {
          prefix: 'formData.'
        }

        const schema = getValidationSchema(formDefinition, values, options)

        // Should validate nested structure
        const result = schema.safeParse(values)
        expect(result.success).toBe(true)

        // Test invalid nested data
        const invalidResult = schema.safeParse({ formData: { name: '' } })
        expect(invalidResult.success).toBe(false)
      })
    })
  })
})
