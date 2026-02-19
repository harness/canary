import { JSX, useCallback } from 'react'

import { Controller, IInputDefinition, InputComponent, RenderInputs, useFieldArray } from '@harnessio/forms'
import { Button, IconV2 } from '@harnessio/ui/components'

import { useDynamicController } from '../common/hooks/use-dynamic-controller'
import { InputLabel } from '../common/input-label'
import { InputWrapper } from '../common/input-wrapper'
import { MultiTypeSelectButton } from '../common/multi-type-select-button'
import { useMultiTypeValue } from '../common/use-multitype-value'
import { useIsOptionalLabelVisible } from '../common/utils/form-utils'
import { ArrayFormInputProps, ArrayFormInputType, ArrayFormInputValueType } from './array-form-input-types'

export type UIInputWithConfigsForArray = Omit<IInputDefinition, 'path'>

function ArrayFormInputInternal(props: ArrayFormInputProps): JSX.Element {
  const { path, input, factory, readonly, disabled } = props
  const { label, inputConfig } = input

  const { fields, append, remove } = useFieldArray({
    name: path
  })

  const { field } = useDynamicController<ArrayFormInputValueType>({
    name: path
  })

  const getChildInputs = useCallback(
    (rowInput: UIInputWithConfigsForArray, parentPath: string, idx: number): IInputDefinition[] => {
      const retInput = {
        ...rowInput,
        // NOTE: create absolute path using parent path and index
        path: `${parentPath}[${idx}]`
      } as IInputDefinition

      return [retInput]
    },
    []
  )

  const { inputValueType, setInputValueType, onlyFixedValueAllowed } = useMultiTypeValue({
    value: field.value,
    changeValue: field.onChange,
    allowedValueTypes: input.inputConfig?.allowedValueTypes,
    defaultValue: input.default
  })

  const optionalLabelVisible = useIsOptionalLabelVisible(input)

  return (
    <InputWrapper {...props} inputValueType={inputValueType} setInputValueType={setInputValueType} placement="label">
      <InputLabel
        label={label}
        showOptional={optionalLabelVisible}
        suffix={
          !onlyFixedValueAllowed ? (
            <MultiTypeSelectButton.Default
              inputValueType={inputValueType}
              setInputValueType={setInputValueType}
              allowedValueTypes={input.inputConfig?.allowedValueTypes}
            />
          ) : undefined
        }
      />
      {/* TODO: do we need Controller ? */}
      <Controller
        name={path}
        render={() => (
          <div>
            <div className="space-y-cn-md flex flex-col">
              {fields.map((item, idx) => {
                return (
                  <div key={item.id} className="space-x-cn-xs flex items-end">
                    <div className="grow">
                      {inputConfig?.input && (
                        <RenderInputs items={getChildInputs(inputConfig?.input, path, idx)} factory={factory} />
                      )}
                    </div>
                    <div>
                      <Button
                        iconOnly
                        onClick={() => {
                          remove(idx)
                        }}
                        disabled={readonly || disabled}
                        variant="ghost"
                        tooltipProps={{ content: 'Remove' }}
                      >
                        <IconV2 name="trash" />
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>

            <div>
              <Button
                size="sm"
                onClick={() => append(input.default ?? undefined)}
                className="mt-cn-xs"
                disabled={readonly || disabled}
              >
                Add
              </Button>
            </div>
          </div>
        )}
      />
    </InputWrapper>
  )
}

export class ArrayFormInput extends InputComponent<ArrayFormInputValueType> {
  public internalType: ArrayFormInputType = 'array'

  renderComponent(props: ArrayFormInputProps): JSX.Element {
    return <ArrayFormInputInternal {...props} />
  }
}
