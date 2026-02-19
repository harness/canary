import type { IFormDefinition } from '@harnessio/forms'

// Generate inputs for performance testing
const generateInputs = (count: number) => {
  const inputs = []

  for (let i = 0; i < count; i++) {
    const inputType = i % 3 === 0 ? 'text' : i % 3 === 1 ? 'boolean' : 'select'

    if (inputType === 'text') {
      inputs.push({
        inputType: 'text',
        path: `performance.text.input.${i}`,
        label: `Performance Text Input ${i}`,
        placeholder: `Enter text value ${i}`,
        default: `default-text-${i}`
      })
    } else if (inputType === 'boolean') {
      inputs.push({
        inputType: 'boolean',
        path: `performance.boolean.input.${i}`,
        label: `Performance Boolean Input ${i}`,
        default: i % 2 === 0
      })
    } else {
      inputs.push({
        inputType: 'select',
        path: `performance.select.input.${i}`,
        label: `Performance Select Input ${i}`,
        default: i % 3 === 0 ? 'option-a' : i % 3 === 1 ? 'option-b' : 'option-c',
        inputConfig: {
          options: [
            { label: 'Option A', value: 'option-a' },
            { label: 'Option B', value: 'option-b' },
            { label: 'Option C', value: 'option-c' }
          ]
        }
      })
    }
  }

  return inputs
}

export const appendInputsPerformanceSchema: IFormDefinition = {
  inputs: generateInputs(200)
}
