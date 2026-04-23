import { getTransformers, inputTransformValues, outputTransformValues } from '../core/utils/transform-utils'
import type { IFormDefinition, IInputTransformerFunc, IOutputTransformerFunc } from '../types'

describe('Transformer Chaining', () => {
  describe('outputTransformValues - chaining behavior', () => {
    it('should chain multiple output transformers, passing output of one as input to next', () => {
      // First transformer: extract `value` from object
      const extractValue: IOutputTransformerFunc = (val: any) => {
        if (val && typeof val === 'object' && 'value' in val) {
          return { value: val.value }
        }
        return { value: val }
      }

      // Second transformer: uppercase the string
      const uppercase: IOutputTransformerFunc = (val: any) => {
        if (typeof val === 'string') {
          return { value: val.toUpperCase() }
        }
        return { value: val }
      }

      const formDefinition: IFormDefinition = {
        inputs: [
          {
            inputType: 'text',
            path: 'test',
            outputTransform: [extractValue, uppercase]
          }
        ]
      }

      const values = { test: { value: 'hello' } }
      const transformers = getTransformers(formDefinition)
      const result = outputTransformValues(values, transformers, true)

      // Should apply extractValue first (gets "hello"), then uppercase (gets "HELLO")
      expect(result.test).toBe('HELLO')
    })

    it('should handle service-like transformation chain', () => {
      // Simulates serviceOutputTransformer: extract ID from items array
      const extractId: IOutputTransformerFunc = (val: any) => {
        if (val && typeof val === 'object' && 'items' in val && Array.isArray(val.items)) {
          const items = val.items
          if (items.length === 0) return { value: undefined }
          if (items.length === 1) {
            return { value: typeof items[0] === 'string' ? items[0] : items[0].id }
          }
          return { value: items.map((item: any) => (typeof item === 'string' ? item : item.id)) }
        }
        return { value: val }
      }

      // Simulates unsetEmptyStringOutputTransformer: unset if empty string
      const unsetEmpty: IOutputTransformerFunc = (val: any) => {
        if (typeof val === 'string' && val === '') {
          return { value: undefined }
        }
        return { value: val }
      }

      const formDefinition: IFormDefinition = {
        inputs: [
          {
            inputType: 'custom',
            path: 'service',
            outputTransform: [extractId, unsetEmpty]
          }
        ]
      }

      const values = {
        service: {
          items: [
            {
              id: 'service_123',
              name: 'My Service',
              deploymentType: 'Kubernetes'
            }
          ]
        }
      }

      const transformers = getTransformers(formDefinition)
      const result = outputTransformValues(values, transformers, true)

      // Should extract just the ID string
      expect(result.service).toBe('service_123')
    })

    it('should handle empty service transformation', () => {
      const extractId: IOutputTransformerFunc = (val: any) => {
        if (val && typeof val === 'object' && 'items' in val && Array.isArray(val.items)) {
          const items = val.items
          if (items.length === 0) return { value: '' }
        }
        return { value: val }
      }

      const unsetEmpty: IOutputTransformerFunc = (val: any) => {
        if (typeof val === 'string' && val === '') {
          return { value: undefined }
        }
        return { value: val }
      }

      const formDefinition: IFormDefinition = {
        inputs: [
          {
            inputType: 'custom',
            path: 'service',
            outputTransform: [extractId, unsetEmpty]
          }
        ]
      }

      const values = { service: { items: [] } }
      const transformers = getTransformers(formDefinition)
      const result = outputTransformValues(values, transformers, true)

      // First transformer returns empty string, second should unset it
      expect(result.service).toBeUndefined()
    })

    it('should chain three transformers correctly', () => {
      const addPrefix: IOutputTransformerFunc = (val: any) => ({ value: `prefix_${val}` })
      const addSuffix: IOutputTransformerFunc = (val: any) => ({ value: `${val}_suffix` })
      const uppercase: IOutputTransformerFunc = (val: any) => ({ value: val.toUpperCase() })

      const formDefinition: IFormDefinition = {
        inputs: [
          {
            inputType: 'text',
            path: 'field',
            outputTransform: [addPrefix, addSuffix, uppercase]
          }
        ]
      }

      const values = { field: 'test' }
      const transformers = getTransformers(formDefinition)
      const result = outputTransformValues(values, transformers, true)

      expect(result.field).toBe('PREFIX_TEST_SUFFIX')
    })
  })

  describe('inputTransformValues - chaining behavior', () => {
    it('should chain multiple input transformers', () => {
      const lowercase: IInputTransformerFunc = (val: any) => {
        if (typeof val === 'string') {
          return { value: val.toLowerCase() }
        }
        return { value: val }
      }

      const trim: IInputTransformerFunc = (val: any) => {
        if (typeof val === 'string') {
          return { value: val.trim() }
        }
        return { value: val }
      }

      const formDefinition: IFormDefinition = {
        inputs: [
          {
            inputType: 'text',
            path: 'test',
            inputTransform: [lowercase, trim]
          }
        ]
      }

      const values = { test: '  HELLO WORLD  ' }
      const transformers = getTransformers(formDefinition)
      const result = inputTransformValues(values, transformers)

      // Should apply lowercase first, then trim
      expect(result.test).toBe('hello world')
    })

    it('should handle service-like input transformation', () => {
      // Convert string to object with items array
      const toItemsArray: IInputTransformerFunc = (val: any) => {
        if (typeof val === 'string') {
          return { value: { items: [{ id: val }] } }
        }
        if (Array.isArray(val)) {
          return { value: { items: val.map(v => (typeof v === 'string' ? { id: v } : v)) } }
        }
        return { value: val }
      }

      const formDefinition: IFormDefinition = {
        inputs: [
          {
            inputType: 'custom',
            path: 'service',
            inputTransform: toItemsArray
          }
        ]
      }

      const values = { service: 'service_123' }
      const transformers = getTransformers(formDefinition)
      const result = inputTransformValues(values, transformers)

      expect(result.service).toEqual({ items: [{ id: 'service_123' }] })
    })
  })

  describe('Edge cases', () => {
    it('should handle transformer returning undefined in the middle of chain', () => {
      const returnUndefined: IOutputTransformerFunc = () => ({ value: undefined })
      const shouldNotRun: IOutputTransformerFunc = (val: any) => {
        // This should receive undefined from previous transformer
        expect(val).toBeUndefined()
        return { value: 'should-still-run' }
      }

      const formDefinition: IFormDefinition = {
        inputs: [
          {
            inputType: 'text',
            path: 'test',
            outputTransform: [returnUndefined, shouldNotRun]
          }
        ]
      }

      const values = { test: 'original' }
      const transformers = getTransformers(formDefinition)
      const result = outputTransformValues(values, transformers, true)

      expect(result.test).toBe('should-still-run')
    })

    it('should handle transformer that changes the path', () => {
      const movePath: IOutputTransformerFunc = (val: any) => ({
        value: val,
        path: 'newPath'
      })

      const formDefinition: IFormDefinition = {
        inputs: [
          {
            inputType: 'text',
            path: 'oldPath',
            outputTransform: movePath
          }
        ]
      }

      const values = { oldPath: 'test-value' }
      const transformers = getTransformers(formDefinition)
      const result = outputTransformValues(values, transformers, true)

      expect(result.newPath).toBe('test-value')
      expect(result.oldPath).toBeUndefined()
    })

    it('should preserve rawValues as second parameter for context', () => {
      let receivedRawValues: any

      const checkRawValues: IOutputTransformerFunc = (val: any, rawVals: any) => {
        receivedRawValues = rawVals
        return { value: val }
      }

      const transformSecond: IOutputTransformerFunc = (val: any, rawVals: any) => {
        // Second transformer should still receive original rawValues, not transformed ones
        expect(rawVals).toEqual(receivedRawValues)
        return { value: `${val}_modified` }
      }

      const formDefinition: IFormDefinition = {
        inputs: [
          {
            inputType: 'text',
            path: 'test',
            outputTransform: [checkRawValues, transformSecond]
          }
        ]
      }

      const values = { test: 'value', other: 'field' }
      const transformers = getTransformers(formDefinition)
      outputTransformValues(values, transformers, true)

      expect(receivedRawValues).toEqual(values)
    })

    it('should handle multiple fields with chained transformers independently', () => {
      const addPrefix: IOutputTransformerFunc = (val: any) => ({ value: `prefix_${val}` })
      const uppercase: IOutputTransformerFunc = (val: any) => ({ value: val.toUpperCase() })

      const formDefinition: IFormDefinition = {
        inputs: [
          {
            inputType: 'text',
            path: 'field1',
            outputTransform: [addPrefix, uppercase]
          },
          {
            inputType: 'text',
            path: 'field2',
            outputTransform: [addPrefix, uppercase]
          }
        ]
      }

      const values = { field1: 'hello', field2: 'world' }
      const transformers = getTransformers(formDefinition)
      const result = outputTransformValues(values, transformers, true)

      expect(result.field1).toBe('PREFIX_HELLO')
      expect(result.field2).toBe('PREFIX_WORLD')
    })

    it('should handle single transformer in array same as without array', () => {
      const uppercase: IOutputTransformerFunc = (val: any) => ({ value: val.toUpperCase() })

      const formDefinition: IFormDefinition = {
        inputs: [
          {
            inputType: 'text',
            path: 'test',
            outputTransform: [uppercase] // Array with single transformer
          }
        ]
      }

      const values = { test: 'hello' }
      const transformers = getTransformers(formDefinition)
      const result = outputTransformValues(values, transformers, true)

      expect(result.test).toBe('HELLO')
    })
  })
})
