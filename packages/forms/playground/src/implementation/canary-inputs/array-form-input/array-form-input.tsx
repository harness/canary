import { JSX, useCallback, useEffect } from 'react'

import {
  Controller,
  IInputDefinition,
  InputComponent,
  RenderInputs,
  useFieldArray,
  useFormContext
} from '@harnessio/forms'
import { Button, IconV2 } from '@harnessio/ui/components'

import { useDynamicController } from '../common/hooks/use-dynamic-controller'
import { InputLabel } from '../common/input-label'
import { InputWrapper } from '../common/input-wrapper'
import { MultiTypeSelectButton } from '../common/multi-type-select-button'
import { useMultiTypeValue } from '../common/use-multitype-value'
import { useIsOptionalLabelVisible } from '../common/utils/form-utils'
import { getInputValueType } from '../common/utils/input-value-utils'
import { ArrayFormInputProps, ArrayFormInputType, ArrayFormInputValueType } from './array-form-input-types'

export type UIInputWithConfigsForArray = Omit<IInputDefinition, 'path'>

function getAppendDefaultValue(input: ArrayFormInputProps['input']) {
  return typeof input.default !== 'undefined' && getInputValueType(input.default) === 'fixed'
    ? input.default
    : undefined
}

function FixedArrayInput(props: Pick<ArrayFormInputProps, 'path' | 'input' | 'factory' | 'readonly' | 'disabled'>) {
  const { path, input, factory, readonly, disabled } = props
  const { inputConfig } = input
  const { watch, setValue } = useFormContext()
  const fieldValue = watch(path)

  useEffect(() => {
    if (!Array.isArray(fieldValue)) {
      setValue(path, [], { shouldDirty: true })
    }
  }, [fieldValue, path, setValue])

  const { fields, append, remove } = useFieldArray({
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

  return (
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
              onClick={() => append(getAppendDefaultValue(input))}
              className="mt-cn-xs"
              disabled={readonly || disabled}
            >
              Add
            </Button>
          </div>
        </div>
      )}
    />
  )
}

function ArrayFormInputInternal(props: ArrayFormInputProps): JSX.Element {
  const { path, input } = props
  const { label } = input

  const { field } = useDynamicController<ArrayFormInputValueType>({
    name: path
  })

  const { inputValueType, setInputValueType, onlyFixedValueAllowed } = useMultiTypeValue({
    value: field.value,
    changeValue: field.onChange,
    allowedValueTypes: input.inputConfig?.allowedValueTypes,
    defaultValue: input.default,
    defaultEmptyValue: []
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
      <FixedArrayInput {...props} />
    </InputWrapper>
  )
}

export class ArrayFormInput extends InputComponent<ArrayFormInputValueType> {
  public internalType: ArrayFormInputType = 'array'

  renderComponent(props: ArrayFormInputProps): JSX.Element {
    return <ArrayFormInputInternal {...props} />
  }
}
