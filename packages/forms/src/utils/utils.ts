import { capitalize, forOwn, isNull, isUndefined } from 'lodash-es'

import type { IFormDefinition, IInputDefinition } from '../types/types'

export function isChildrenEmpty(obj: { [key: string]: unknown }): boolean {
  let empty = true
  forOwn(obj, val => {
    empty = empty && (val === '' || isNull(val) || isUndefined(val))
  })

  return empty
}

export const generateReadableLabel = (name = ''): string => {
  return capitalize(name.split('_').join(' '))
}

export const afterFrames = (cb: () => void, frames = 2, mountTime?: number, immediateMs = 1000) => {
  let cancelled = false
  const step = () => {
    requestAnimationFrame(() => {
      if (cancelled) return
      frames -= 1
      frames <= 0 ? cb() : step()
    })
  }

  // If mountTime provided, check if we should call immediately
  if (mountTime) {
    const timeSinceMount = Date.now() - mountTime
    if (timeSinceMount <= immediateMs) {
      // First immediateMs: call immediately for performance
      cb()
      return () => {} // Return empty cancel function
    }
  }

  step()
  return () => {
    cancelled = true
  }
}

/**
 * Applies override properties to all inputs in a form definition.
 * Creates a new form definition with overrides merged into each input.
 *
 * @param formDefinition - The form definition to process
 * @param overrideName - Optional name of the specific override to apply (e.g., 'input-set')
 * @returns A new form definition with overrides applied
 *
 * @example
 * // Apply 'input-set' override
 * const inputSetFormDefinition = applyFormOverrides(formDefinition, 'input-set')
 */
export function applyFormOverrides<T extends IInputDefinition<any, any, any>>(
  formDefinition: IFormDefinition<T>,
  overrideName?: string
): IFormDefinition<Omit<T, 'override'>> {
  return {
    ...formDefinition,
    inputs: formDefinition.inputs.map(input => applyInputOverride(input, overrideName))
  }
}

/**
 * Applies override properties to a single input definition.
 * Recursively processes nested inputs.
 *
 * @param input - The input definition to process
 * @param overrideName - Optional name of the specific override to apply
 * @returns A new input definition with override applied
 */
export function applyInputOverride<T extends IInputDefinition<any, any, any>>(
  input: T,
  overrideName?: string
): Omit<T, 'override'> {
  const { override: overrides, ...baseInput } = input

  // Step 1: Select the specific override if overrideName is provided
  const selectedOverride = overrideName && overrides ? overrides[overrideName] : undefined

  // Step 2: Merge override properties into base input (excluding inputConfig for special handling)
  const { inputConfig: overrideInputConfig, ...restOverride } = selectedOverride || {}
  const mergedInput = selectedOverride ? { ...baseInput, ...restOverride } : baseInput

  // Step 3: Merge inputConfig separately to handle nested inputs properly
  if (baseInput.inputConfig || overrideInputConfig) {
    mergedInput.inputConfig = { ...baseInput.inputConfig, ...overrideInputConfig }
  }

  // Step 4: Recursively process nested inputs based on where they are located

  // Handle top-level nested inputs (e.g., "group" type has inputs array)
  if (mergedInput.inputs) {
    mergedInput.inputs = mergedInput.inputs.map(child => applyInputOverride(child, overrideName))
  }

  // Handle "list" type: inputConfig.inputs is an array
  if (mergedInput.inputType === 'list' && mergedInput.inputConfig) {
    const baseInputs = baseInput.inputConfig?.inputs || []
    const overrideInputs = overrideInputConfig?.inputs || []

    if (baseInputs.length > 0 || overrideInputs.length > 0) {
      const maxLength = Math.max(baseInputs.length, overrideInputs.length)
      mergedInput.inputConfig.inputs = Array.from({ length: maxLength }, (_, index) => {
        const baseChild = baseInputs[index]
        const overrideChild = overrideInputs[index]

        if (!baseChild && overrideChild) return applyInputOverride(overrideChild, overrideName)
        if (baseChild && !overrideChild) return applyInputOverride(baseChild, overrideName)
        if (baseChild && overrideChild) {
          // Merge child's own override with parent-provided override at the specified name
          const mergedChildOverrides = baseChild.override ? { ...baseChild.override } : {}
          if (overrideName && overrideChild) {
            mergedChildOverrides[overrideName] = baseChild.override?.[overrideName]
              ? { ...baseChild.override[overrideName], ...overrideChild }
              : overrideChild
          }
          return applyInputOverride({ ...baseChild, override: mergedChildOverrides }, overrideName)
        }
        return undefined
      }).filter(Boolean) as any
    } else if (mergedInput.inputConfig.inputs) {
      mergedInput.inputConfig.inputs = mergedInput.inputConfig.inputs.map((child: any) =>
        applyInputOverride(child, overrideName)
      )
    }
  }

  // Handle "array" type: inputConfig.input is a single input
  if (mergedInput.inputType === 'array' && mergedInput.inputConfig) {
    const baseChildInput = baseInput.inputConfig?.input
    const overrideChildInput = overrideInputConfig?.input

    if (baseChildInput && overrideChildInput) {
      // Merge child's own override with parent-provided override at the specified name
      const mergedChildOverrides = baseChildInput.override ? { ...baseChildInput.override } : {}
      if (overrideName && overrideChildInput) {
        mergedChildOverrides[overrideName] = baseChildInput.override?.[overrideName]
          ? { ...baseChildInput.override[overrideName], ...overrideChildInput }
          : overrideChildInput
      }
      mergedInput.inputConfig.input = applyInputOverride(
        { ...baseChildInput, override: mergedChildOverrides },
        overrideName
      )
    } else if (mergedInput.inputConfig.input) {
      mergedInput.inputConfig.input = applyInputOverride(mergedInput.inputConfig.input, overrideName)
    }
  }

  return mergedInput as Omit<T, 'override'>
}
