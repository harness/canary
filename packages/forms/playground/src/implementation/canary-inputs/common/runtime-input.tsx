import { JSX, useEffect, useState } from 'react'

import { IInputDefinition } from '@harnessio/forms'
import { Select } from '@harnessio/ui/components'

import { CommonFormInputConfig, InputValueType } from '../../types/types'
import { InputLabel } from './input-label'
import { MultiTypeSelectButton } from './multi-type-select-button'
import { useIsOptionalLabelVisible } from './utils/form-utils'
import { constructRuntimeInputValue, extractRuntimeInputName, RUNTIME_INPUT } from './utils/input-value-utils'

export interface RuntimeInputProps {
  value?: string
  onInputChange?: (value?: string) => void
  label?: string
  required?: boolean
  onInputValueTypeChange?: (inputValueType: InputValueType) => void
  placement?: 'prefix' | 'label' | 'generic'
  input: IInputDefinition<CommonFormInputConfig | undefined>
  tooltipContent?: any
}

function RuntimeInput(props: RuntimeInputProps): JSX.Element | null {
  const { label, required, value, onInputChange, onInputValueTypeChange, placement, input, tooltipContent } = props

  const [localValue, setLocalValue] = useState(value)
  useEffect(() => {
    if (localValue !== value) {
      setLocalValue(value)
    }
  }, [value])

  const optionalLabelVisible = useIsOptionalLabelVisible(input)

  return (
    <>
      <InputLabel
        label={label}
        tooltip={tooltipContent}
        showOptional={optionalLabelVisible}
        suffix={
          placement === 'label' ? (
            <MultiTypeSelectButton.ForLabel
              inputValueType={'runtime'}
              setInputValueType={newInputValueType => {
                if (newInputValueType === 'runtime') {
                  return
                }
                onInputValueTypeChange?.(newInputValueType)
              }}
            />
          ) : undefined
        }
      />
      <Select
        placeholder="Select or create input..."
        optional={!required}
        value={extractRuntimeInputName(value)}
        onChange={value => {
          onInputChange?.(constructRuntimeInputValue(value))
        }}
        contentWidth="triggerWidth"
        options={[{ label: RUNTIME_INPUT, value: RUNTIME_INPUT }]}
        prefix={
          placement === 'prefix' ? (
            <MultiTypeSelectButton.ForPrefix
              inputValueType={'runtime'}
              setInputValueType={newInputValueType => {
                if (newInputValueType === 'runtime') {
                  return
                }
                onInputValueTypeChange?.(newInputValueType)
              }}
            />
          ) : null
        }
      />
    </>
  )
}

export { RuntimeInput }
