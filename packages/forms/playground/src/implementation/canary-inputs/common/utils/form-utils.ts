import { useMemo } from 'react'

import { isNil } from 'lodash-es'

import { AnyFormValue, IInputDefinition, IInputTransformerFunc } from '@harnessio/forms'

import { CommonFormInputConfig, ViewFormInputConfig } from '../../../types/types'
import { useAccordionFormInputContext } from '../../accordion-form-input/accordion-form-input-context'
import { GroupFormInputConfig } from '../../group-form-input/group-form-input-types'

/** This function returns the label to be displayed for the "view" inputs */
export function getInputViewLabel(input: IInputDefinition<ViewFormInputConfig | undefined>) {
  const { inputConfig } = input

  return inputConfig?.viewConfig?.label ?? input.label ?? ''
}

export function isOptionalVisibilityAuto(
  input: Pick<IInputDefinition<CommonFormInputConfig | undefined>, 'required' | 'inputConfig'>
): boolean {
  return (
    !input.inputConfig ||
    typeof input.inputConfig?.optionalVisibility === 'undefined' ||
    input.inputConfig?.optionalVisibility === 'auto'
  )
}

export function isOptionalLabelVisible(
  input: Pick<IInputDefinition<CommonFormInputConfig | undefined>, 'required' | 'inputConfig'>
): boolean {
  switch (input.inputConfig?.optionalVisibility) {
    case 'visible':
      return true
    case 'hidden':
      return false
    case 'use-required':
    case 'auto':
      return !input.required
    default:
      return !input.required
  }
}

export function isExpanded(input: { inputConfig?: GroupFormInputConfig }): boolean | undefined {
  switch (input.inputConfig?.expanded) {
    case 'yes':
      return true
    case 'no':
      return false
    case 'auto':
      return undefined
    default:
      return undefined
  }
}

export function useIsOptionalLabelVisible(input: IInputDefinition<CommonFormInputConfig | undefined>) {
  const { optionalVisibilityState } = useAccordionFormInputContext() ?? {}

  return useMemo(() => {
    // if input is inside accordion we have accordion context
    if (optionalVisibilityState && optionalVisibilityState.size > 0) {
      return optionalVisibilityState.get(input.path)
    }

    // if input is not inside accordion
    return isOptionalLabelVisible(input)
  }, [input, optionalVisibilityState])
}

export function autoUpdateAccordionState(
  groupInput: IInputDefinition<CommonFormInputConfig>,
  values: AnyFormValue,
  optionalVisibilityState: Map<string, boolean>,
  autoExpandState: Map<string, boolean>
) {
  if (isOptionalVisibilityAuto(groupInput)) {
    let isAllChildOptional = true

    const inputs = flattenInputs(groupInput.inputs ?? [])

    inputs?.forEach(chidInput => {
      if (chidInput.isVisible && !chidInput.isVisible(values, {})) {
        // ignore non visible fields
        return
      }
      const optionalVisible = isOptionalLabelVisible(chidInput as IInputDefinition<CommonFormInputConfig>)
      isAllChildOptional = isAllChildOptional && optionalVisible
    })

    optionalVisibilityState.set(groupInput.path, isAllChildOptional)

    // remove 'optional' label visibility on all child
    inputs?.forEach(chidInput => {
      if (isAllChildOptional) {
        optionalVisibilityState.set(chidInput.path, false)
      } else {
        optionalVisibilityState.set(
          chidInput.path,
          isOptionalLabelVisible(chidInput as IInputDefinition<CommonFormInputConfig>)
        )
      }
    })

    // if expanded state is explicitly set
    const expanded = isExpanded(groupInput)

    autoExpandState.set(groupInput.path, typeof expanded !== 'undefined' ? expanded : !isAllChildOptional)
  }
}

export function convertAccordionStateMap2AccordionValue(explicitExpandState: Map<string, boolean>) {
  return Array.from(explicitExpandState.entries())
    .filter(([_, value]) => value)
    .map(([key]) => key)
}

/**
 * Custom input transformer for tags that converts API object format to MultiSelectOption array
 * This ensures proper id field generation for MultiSelect component compatibility
 * @param value The tags object from API (e.g., {"a": "a", "b": "1"})
 * @returns Transformed value with id, key, and value fields for MultiSelect
 */
export const tagsToArrayTransformer = (): IInputTransformerFunc => {
  return function (value: Record<string, unknown>) {
    if (typeof value === 'undefined') return undefined
    if (!value) return { value: [] }

    return {
      value: Object.getOwnPropertyNames(value).map(key => {
        const val = value[key] as string
        const id = [key, val].filter(Boolean).join(':')
        return {
          key,
          value: val, // Always include the value
          id
        }
      })
    }
  }
}

/**
 * Converts a tags string in format "key1:value1,key2:value2" to an object { key1: "value1", key2: "value2" }
 * Handles edge cases like values containing colons and empty values
 * @param tags The tags input - can be a string, object, or undefined
 * @returns The tags as a Record<string, string> object
 */
export function parseTagsStringToObject(tags: string | Record<string, string> | undefined): Record<string, string> {
  if (!tags) return {}

  if (typeof tags === 'object') {
    return tags
  }

  if (typeof tags === 'string') {
    const tagsObject: Record<string, string> = {}
    tags.split(',').forEach(tag => {
      const trimmedTag = tag.trim()
      if (trimmedTag) {
        const [key, ...valueParts] = trimmedTag.split(':')
        const value = valueParts.join(':') // Handle values that might contain ':'
        if (key) {
          tagsObject[key.trim()] = value?.trim() || ''
        }
      }
    })
    return tagsObject
  }

  return {}
}

/**
 * Formats a label by automatically appending a colon unless it already has one
 * @param label The label to format
 * @param appendColon Whether to append colon (defaults to true)
 * @returns The formatted label with colon appended if needed
 */
export function formatLabel(label?: string, appendColon: boolean = true): string | undefined {
  if (!label) return label
  return appendColon && !label.endsWith(':') ? `${label}:` : label
}

/**
 * Filtered input with its full path for rendering
 */
export interface FilteredInputWithPath {
  input: IInputDefinition
  fullPath: string
}

export function isFieldValueEmpty(value: unknown): boolean {
  if (isNil(value || value === '' || (Array.isArray(value) && value.length === 0))) return true
  return false
}

/**
 * Flatten nested inputs from accordion/group structures
 */
export function flattenInputs(inputs: IInputDefinition[]): IInputDefinition[] {
  const result: IInputDefinition[] = []

  for (const input of inputs) {
    if (input.inputType === 'accordion' || input.inputType === 'group' || input.inputType === 'slot') {
      if ((input as any).inputs) {
        result.push(...flattenInputs((input as any).inputs))
      }
    } else {
      result.push(input)
    }
  }

  return result
}
