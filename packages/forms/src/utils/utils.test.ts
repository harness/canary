import type { IFormDefinition, IInputDefinition } from '../types/types'
import { applyFormOverrides, applyInputOverride } from './utils'

describe('Override Utilities', () => {
  describe('applyInputOverride', () => {
    describe('text input type', () => {
      it('should apply named override to text input', () => {
        const input: IInputDefinition = {
          inputType: 'text',
          path: 'username',
          label: 'Username',
          placeholder: 'Enter username',
          required: false,
          override: {
            'input-set': {
              label: 'User Name',
              placeholder: 'Type your username',
              required: true
            }
          }
        }

        const result = applyInputOverride(input, 'input-set')

        expect(result.inputType).toBe('text')
        expect(result.path).toBe('username')
        expect(result.label).toBe('User Name')
        expect(result.placeholder).toBe('Type your username')
        expect(result.required).toBe(true)
        expect('override' in result).toBe(false)
      })

      it('should handle text input without override name', () => {
        const input: IInputDefinition = {
          inputType: 'text',
          path: 'email',
          label: 'Email',
          required: true
        }

        const result = applyInputOverride(input)

        expect(result.inputType).toBe('text')
        expect(result.path).toBe('email')
        expect(result.label).toBe('Email')
        expect(result.required).toBe(true)
        expect('override' in result).toBe(false)
      })

      it('should override inputConfig for text input', () => {
        const input: IInputDefinition<{ type: string; maxLength: number }> = {
          inputType: 'text',
          path: 'password',
          label: 'Password',
          inputConfig: { type: 'text', maxLength: 100 },
          override: {
            secure: {
              inputConfig: { type: 'password', maxLength: 50 }
            }
          }
        }

        const result = applyInputOverride(input, 'secure') as any

        expect(result.inputConfig?.type).toBe('password')
        expect(result.inputConfig?.maxLength).toBe(50)
        expect('override' in result).toBe(false)
      })

      it('should partially override inputConfig', () => {
        const input: IInputDefinition<{ type?: string; maxLength?: number; minLength?: number }> = {
          inputType: 'text',
          path: 'name',
          inputConfig: { type: 'text', maxLength: 100, minLength: 2 },
          override: {
            compact: {
              inputConfig: { maxLength: 50 }
            }
          }
        }

        const result = applyInputOverride(input, 'compact') as any

        expect(result.inputConfig?.type).toBe('text')
        expect(result.inputConfig?.maxLength).toBe(50)
        expect(result.inputConfig?.minLength).toBe(2)
      })

      it('should apply different overrides based on name', () => {
        const input: IInputDefinition = {
          inputType: 'text',
          path: 'username',
          label: 'Username',
          override: {
            'input-set': { label: 'Mobile User', required: true },
            desktop: { label: 'Desktop User', placeholder: 'Enter username' }
          }
        }

        const mobileResult = applyInputOverride(input, 'input-set')
        const desktopResult = applyInputOverride(input, 'desktop')

        expect(mobileResult.label).toBe('Mobile User')
        expect(mobileResult.required).toBe(true)

        expect(desktopResult.label).toBe('Desktop User')
        expect(desktopResult.placeholder).toBe('Enter username')
      })
    })

    describe('list input type', () => {
      it('should recursively apply overrides to list inputs', () => {
        const input: IInputDefinition = {
          inputType: 'list',
          path: 'users',
          label: 'Users',
          inputConfig: {
            inputs: [
              { inputType: 'text', relativePath: 'name', label: 'Name' },
              { inputType: 'text', relativePath: 'email', label: 'Email', required: false }
            ]
          }
        }

        const result = applyInputOverride(input, 'input-set')

        expect((result as any).inputConfig?.inputs).toHaveLength(2)
        expect((result as any).inputConfig?.inputs[0].label).toBe('Name')
        expect((result as any).inputConfig?.inputs[1].label).toBe('Email')
      })

      it('should apply override to list inputConfig.inputs', () => {
        const input: IInputDefinition = {
          inputType: 'list',
          path: 'team',
          label: 'Team',
          inputConfig: {
            inputs: [
              { inputType: 'text', relativePath: 'firstName', label: 'First' },
              { inputType: 'text', relativePath: 'lastName', label: 'Last' }
            ]
          },
          override: {
            'input-set': {
              inputConfig: {
                inputs: [
                  { inputType: 'text', relativePath: 'firstName', label: 'First Name', required: true },
                  { inputType: 'text', relativePath: 'lastName', label: 'Last Name', placeholder: 'Surname' }
                ]
              }
            }
          }
        }

        const result = applyInputOverride(input, 'input-set')

        expect((result as any).inputConfig?.inputs).toHaveLength(2)
        expect((result as any).inputConfig?.inputs[0].label).toBe('First Name')
        expect((result as any).inputConfig?.inputs[0].required).toBe(true)
        expect((result as any).inputConfig?.inputs[0].relativePath).toBe('firstName')
        expect((result as any).inputConfig?.inputs[1].label).toBe('Last Name')
        expect((result as any).inputConfig?.inputs[1].placeholder).toBe('Surname')
        expect((result as any).inputConfig?.inputs[1].relativePath).toBe('lastName')
        expect('override' in result).toBe(false)
      })

      it('should handle child with its own override in list', () => {
        const input: IInputDefinition = {
          inputType: 'list',
          path: 'members',
          label: 'Members',
          inputConfig: {
            inputs: [
              {
                inputType: 'text',
                relativePath: 'name',
                label: 'Name',
                placeholder: 'Enter name',
                override: {
                  'input-set': {
                    required: true,
                    placeholder: 'Full name'
                  }
                }
              }
            ]
          },
          override: {
            'input-set': {
              inputConfig: {
                inputs: [{ inputType: 'text', relativePath: 'name', label: 'Member Name', placeholder: 'Type here' }]
              }
            }
          }
        }

        const result = applyInputOverride(input, 'input-set')

        expect((result as any).inputConfig?.inputs).toHaveLength(1)
        expect((result as any).inputConfig?.inputs[0].label).toBe('Member Name')
        expect((result as any).inputConfig?.inputs[0].placeholder).toBe('Type here')
        expect((result as any).inputConfig?.inputs[0].required).toBe(true)
        expect((result as any).inputConfig?.inputs[0].relativePath).toBe('name')
      })

      it('should handle nested list with multiple levels of overrides', () => {
        const input: IInputDefinition = {
          inputType: 'list',
          path: 'departments',
          inputConfig: {
            inputs: [
              {
                inputType: 'list',
                relativePath: 'employees',
                inputConfig: {
                  inputs: [{ inputType: 'text', relativePath: 'name', label: 'Employee Name' }]
                },
                override: {
                  'input-set': {
                    inputConfig: {
                      inputs: [{ inputType: 'text', relativePath: 'name', required: true }]
                    }
                  }
                }
              }
            ]
          }
        }

        const result = applyInputOverride(input, 'input-set')

        const nestedList = (result as any).inputConfig?.inputs[0]
        expect(nestedList.inputConfig?.inputs[0].label).toBe('Employee Name')
        expect(nestedList.inputConfig?.inputs[0].required).toBe(true)
      })
    })

    describe('array input type', () => {
      it('should recursively apply overrides to array input', () => {
        const input: IInputDefinition = {
          inputType: 'array',
          path: 'tags',
          label: 'Tags',
          inputConfig: {
            input: { inputType: 'text', path: '', label: 'Tag' }
          }
        }

        const result = applyInputOverride(input, 'input-set')

        expect((result as any).inputConfig?.input).toBeDefined()
        expect((result as any).inputConfig?.input.label).toBe('Tag')
      })

      it('should apply override to array inputConfig.input', () => {
        const input: IInputDefinition = {
          inputType: 'array',
          path: 'categories',
          label: 'Categories',
          inputConfig: {
            input: { inputType: 'text', path: '', label: 'Category', maxLength: 100 }
          },
          override: {
            'input-set': {
              inputConfig: {
                input: { inputType: 'text', path: '', label: 'Category Name', maxLength: 50, required: true }
              }
            }
          }
        }

        const result = applyInputOverride(input, 'input-set')

        expect((result as any).inputConfig?.input.label).toBe('Category Name')
        expect((result as any).inputConfig?.input.maxLength).toBe(50)
        expect((result as any).inputConfig?.input.required).toBe(true)
        expect((result as any).inputConfig?.input.path).toBe('')
        expect('override' in result).toBe(false)
      })

      it('should handle child with its own override in array', () => {
        const input: IInputDefinition = {
          inputType: 'array',
          path: 'items',
          label: 'Items',
          inputConfig: {
            input: {
              inputType: 'text',
              path: '',
              label: 'Item',
              placeholder: 'Enter item',
              override: {
                'input-set': {
                  required: true,
                  placeholder: 'Item name'
                }
              }
            }
          },
          override: {
            'input-set': {
              inputConfig: {
                input: { inputType: 'text', path: '', label: 'Item Name', placeholder: 'Type here' }
              }
            }
          }
        }

        const result = applyInputOverride(input, 'input-set')

        expect((result as any).inputConfig?.input.label).toBe('Item Name')
        expect((result as any).inputConfig?.input.placeholder).toBe('Type here')
        expect((result as any).inputConfig?.input.required).toBe(true)
      })

      it('should handle nested array with multiple levels of overrides', () => {
        const input: IInputDefinition = {
          inputType: 'array',
          path: 'matrix',
          inputConfig: {
            input: {
              inputType: 'array',
              path: '',
              inputConfig: {
                input: { inputType: 'text', path: '', label: 'Cell' }
              },
              override: {
                'input-set': {
                  inputConfig: {
                    input: { inputType: 'text', path: '', required: true }
                  }
                }
              }
            }
          }
        }

        const result = applyInputOverride(input, 'input-set')

        const nestedArray = (result as any).inputConfig?.input
        expect(nestedArray.inputConfig?.input.label).toBe('Cell')
        expect(nestedArray.inputConfig?.input.required).toBe(true)
      })
    })

    describe('group input type', () => {
      it('should recursively process top-level nested inputs', () => {
        const input: IInputDefinition = {
          inputType: 'group',
          path: 'address',
          label: 'Address',
          inputs: [
            { inputType: 'text', path: 'street', label: 'Street' },
            { inputType: 'text', path: 'city', label: 'City' }
          ]
        }

        const result = applyInputOverride(input, 'input-set')

        expect((result as any).inputs).toHaveLength(2)
        expect((result as any).inputs[0].label).toBe('Street')
        expect((result as any).inputs[1].label).toBe('City')
      })

      it('should apply overrides to nested inputs in group', () => {
        const input: IInputDefinition = {
          inputType: 'group',
          path: 'contact',
          label: 'Contact',
          inputs: [
            {
              inputType: 'text',
              path: 'phone',
              label: 'Phone',
              override: {
                'input-set': { required: true, placeholder: '123-456-7890' }
              }
            }
          ]
        }

        const result = applyInputOverride(input, 'input-set')

        expect((result as any).inputs).toHaveLength(1)
        expect((result as any).inputs[0].label).toBe('Phone')
        expect((result as any).inputs[0].required).toBe(true)
        expect((result as any).inputs[0].placeholder).toBe('123-456-7890')
      })
    })

    describe('edge cases', () => {
      it('should handle input with no inputConfig', () => {
        const input: IInputDefinition = {
          inputType: 'text',
          path: 'simple',
          override: {
            'input-set': { label: 'Simple Field' }
          }
        }

        const result = applyInputOverride(input, 'input-set')

        expect(result.label).toBe('Simple Field')
        expect(result.inputConfig).toBeUndefined()
      })

      it('should handle empty override object', () => {
        const input: IInputDefinition = {
          inputType: 'text',
          path: 'test',
          label: 'Test',
          override: {}
        }

        const result = applyInputOverride(input, 'input-set')

        expect(result.label).toBe('Test')
        expect('override' in result).toBe(false)
      })

      it('should handle non-existent override name', () => {
        const input: IInputDefinition = {
          inputType: 'text',
          path: 'test',
          label: 'Test',
          override: {
            desktop: { label: 'Desktop Test' }
          }
        }

        const result = applyInputOverride(input, 'input-set')

        expect(result.label).toBe('Test') // Should keep original since 'input-set' doesn't exist
      })

      it('should handle list with empty inputs array', () => {
        const input: IInputDefinition = {
          inputType: 'list',
          path: 'empty',
          inputConfig: { inputs: [] }
        }

        const result = applyInputOverride(input, 'input-set')

        expect((result as any).inputConfig?.inputs).toEqual([])
      })

      it('should handle array with undefined input', () => {
        const input: IInputDefinition = {
          inputType: 'array',
          path: 'test',
          inputConfig: {}
        }

        const result = applyInputOverride(input, 'input-set')

        expect((result as any).inputConfig?.input).toBeUndefined()
      })
    })
  })

  describe('applyFormOverrides', () => {
    it('should apply overrides to all inputs in form definition', () => {
      const formDefinition: IFormDefinition = {
        inputs: [
          {
            inputType: 'text',
            path: 'username',
            label: 'Username',
            override: {
              'input-set': { required: true }
            }
          },
          {
            inputType: 'text',
            path: 'email',
            label: 'Email',
            override: {
              'input-set': { placeholder: 'user@example.com' }
            }
          }
        ]
      }

      const result = applyFormOverrides(formDefinition, 'input-set')

      expect(result.inputs).toHaveLength(2)
      expect((result.inputs[0] as any).required).toBe(true)
      expect('override' in result.inputs[0]).toBe(false)
      expect((result.inputs[1] as any).placeholder).toBe('user@example.com')
      expect('override' in result.inputs[1]).toBe(false)
    })

    it('should handle complex nested form with list and array', () => {
      const formDefinition: IFormDefinition = {
        inputs: [
          {
            inputType: 'list',
            path: 'users',
            inputConfig: {
              inputs: [
                { inputType: 'text', relativePath: 'name', label: 'Name' },
                { inputType: 'text', relativePath: 'email', label: 'Email' }
              ]
            },
            override: {
              'input-set': {
                inputConfig: {
                  inputs: [
                    { inputType: 'text', relativePath: 'name', required: true },
                    { inputType: 'text', relativePath: 'email', placeholder: 'email@domain.com' }
                  ]
                }
              }
            }
          },
          {
            inputType: 'array',
            path: 'tags',
            inputConfig: {
              input: { inputType: 'text', path: '', label: 'Tag' }
            },
            override: {
              'input-set': {
                inputConfig: {
                  input: { inputType: 'text', path: '', maxLength: 20 }
                }
              }
            }
          }
        ]
      }

      const result = applyFormOverrides(formDefinition, 'input-set')

      expect(result.inputs).toHaveLength(2)
      expect((result.inputs[0] as any).inputConfig?.inputs[0].required).toBe(true)
      expect((result.inputs[0] as any).inputConfig?.inputs[1].placeholder).toBe('email@domain.com')
      expect((result.inputs[1] as any).inputConfig?.input.maxLength).toBe(20)
    })

    it('should preserve form metadata', () => {
      const formDefinition: IFormDefinition<IInputDefinition, { formId: string }> = {
        metadata: { formId: 'test-form' },
        inputs: [
          {
            inputType: 'text',
            path: 'field',
            override: {
              'input-set': { label: 'Field' }
            }
          }
        ]
      }

      const result = applyFormOverrides(formDefinition, 'input-set')

      expect(result.metadata).toEqual({ formId: 'test-form' })
    })

    it('should apply different overrides based on specified name', () => {
      const formDefinition: IFormDefinition = {
        inputs: [
          {
            inputType: 'text',
            path: 'username',
            label: 'Username',
            override: {
              'input-set': { placeholder: 'Mobile User' },
              desktop: { placeholder: 'Desktop User' }
            }
          }
        ]
      }

      const mobileResult = applyFormOverrides(formDefinition, 'input-set')
      const desktopResult = applyFormOverrides(formDefinition, 'desktop')

      expect((mobileResult.inputs[0] as any).placeholder).toBe('Mobile User')
      expect((desktopResult.inputs[0] as any).placeholder).toBe('Desktop User')
    })
  })
})
