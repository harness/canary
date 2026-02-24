import type { IFormDefinition, IInputDefinition } from '@harnessio/forms'

export interface InputInfo {
  structurePath: string
  path: string
  label: string
}

// Helper function to generate random string
export function generateRandomId(length: number = 5): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''

  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }

  return result
}

export function extractInputPaths(inputs: IInputDefinition[], parentPath: string = ''): InputInfo[] {
  const result: InputInfo[] = []

  for (let i = 0; i < inputs.length; i++) {
    const input = inputs[i]
    const currentStructurePath = parentPath ? `${parentPath}.${i}` : `${i}`

    // Skip list and array inputs
    if (input.inputType === 'list' || input.inputType === 'array') {
      continue
    }

    // Handle group inputs - recurse into them
    if (input.inputType === 'group' && input.inputs) {
      result.push({
        structurePath: currentStructurePath,
        path: input.path,
        label: input.label || input.path
      })

      // Recursively process nested inputs in groups
      const nestedResults = extractInputPaths(input.inputs, currentStructurePath)
      result.push(...nestedResults)
    } else {
      // Regular input
      result.push({
        structurePath: currentStructurePath,
        path: input.path,
        label: input.label || input.path
      })
    }
  }

  return result
}

export function insertInputsAtStructurePath(
  currentInputs: IInputDefinition[],
  structurePath: string,
  newInputs: IInputDefinition[]
): IInputDefinition[] {
  const result = [...currentInputs]

  // Convert simple path like "2.1.0" to array of indices
  const pathParts = structurePath.split('.').map(part => parseInt(part))

  // Get the parent array and index where we should insert
  const parentPath = pathParts.slice(0, -1)
  const insertIndex = pathParts[pathParts.length - 1] + 1

  if (pathParts.length === 1) {
    // Top-level insertion (e.g., "2")
    result.splice(insertIndex, 0, ...newInputs)
  } else {
    // Nested insertion - navigate to parent array
    let current: IInputDefinition[] | undefined = result
    for (let i = 0; i < parentPath.length; i++) {
      const index = parentPath[i]
      const input = current?.[index] as IInputDefinition | undefined
      if (input?.inputs) {
        current = input.inputs
      } else {
        current = undefined // Path not found
        break
      }
    }

    // Insert at the final parent array
    if (current && Array.isArray(current)) {
      current.splice(insertIndex, 0, ...newInputs)
    }
  }

  return result
}

export function deleteSlotByPath(formDefinition: IFormDefinition, slotPath: string): IFormDefinition {
  // Recursive function to handle nested structures
  const deleteSlotByPathRec = (inputs: IInputDefinition[], targetPath: string): IInputDefinition[] => {
    return inputs
      .map(input => {
        // Check if this input matches the target path and set to null
        if (input.path === targetPath) return null as any

        // If this input has nested inputs, check recursively
        if (input.inputs) {
          return {
            ...input,
            inputs: deleteSlotByPathRec(input.inputs, targetPath)
          }
        }

        return input // Keep all other inputs
      })
      .filter(Boolean) as IInputDefinition[]
  }

  // Start with root inputs and recursively remove matching inputs
  const newInputs = deleteSlotByPathRec(formDefinition.inputs, slotPath)

  return {
    ...formDefinition,
    inputs: newInputs
  }
}

export function flattenInputs(inputs: IInputDefinition[]): IInputDefinition[] {
  const result: IInputDefinition[] = []

  for (const input of inputs) {
    result.push(input)

    if (input.inputType === 'group' && input.inputs) {
      result.push(...flattenInputs(input.inputs))
    }
  }

  return result
}

export function getSlotPaths(formDefinition: IFormDefinition): string[] {
  // Only get top-level slot inputs, not nested ones
  const slots = flattenInputs(formDefinition.inputs)
    .filter(input => input.inputType === 'slot')
    .map(input => input.path)

  console.log('All inputs:', formDefinition.inputs)
  console.log('Filtered slots:', slots)

  return slots
}
