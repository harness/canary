import { useCallback, useEffect } from 'react'

import {
  AnyFormValue,
  Controller,
  IInputDefinition,
  InputComponent,
  InputProps,
  RenderInputs,
  useFieldArray,
  useFormContext
} from '@harnessio/forms'
import { Button, IconV2 } from '@harnessio/ui/components'

import { InputCaption } from './common/InputCaption'
import { InputLabel } from './common/InputLabel'
import { InputWrapper } from './common/InputWrapper'
import { RuntimeInputConfig } from './types/types'
import { getInputValueType } from './utils/input-value-utils'

export type UIInputWithConfigsForArray = Omit<IInputDefinition, 'path'>

export interface ArrayFormInputConfig extends RuntimeInputConfig {
  input: IInputDefinition
  tooltip?: string
}

export type ArrayFormInputDefinition = IInputDefinition<ArrayFormInputConfig, AnyFormValue, 'array'>

type ArrayFormInputProps = InputProps<AnyFormValue, ArrayFormInputConfig>

function getAppendDefaultValue(input: ArrayFormInputProps['input']): AnyFormValue {
  return typeof input.default !== 'undefined' && getInputValueType(input.default) === 'fixed'
    ? input.default
    : undefined
}

function FixedArrayInput(props: Pick<ArrayFormInputProps, 'path' | 'input' | 'factory' | 'readonly'>): JSX.Element {
  const { readonly, path, input, factory } = props
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
        <div className="flex flex-col">
          <div>
            {fields.map((item, idx) => (
              <div key={item.id} className="space-x-cn-xs flex items-end">
                {inputConfig?.input && (
                  <RenderInputs items={getChildInputs(inputConfig?.input, path, idx)} factory={factory} />
                )}
                <div>
                  <Button
                    iconOnly
                    className="mt-cn-xs"
                    onClick={() => {
                      remove(idx)
                    }}
                    disabled={readonly}
                    tooltipProps={{ content: 'Remove' }}
                  >
                    <IconV2 name="trash" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <div>
            <Button size="sm" onClick={() => append(getAppendDefaultValue(input))} className="mt-cn-xs">
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
  const { label, required, description } = input

  const { getFieldState, formState } = useFormContext()
  const fieldState = getFieldState(path, formState)
  const { error } = fieldState

  return (
    <InputWrapper {...props} defaultEmptyValue={[]}>
      <InputLabel label={label} required={required} />
      <FixedArrayInput {...props} />
      <InputCaption error={error?.message} caption={description} />
    </InputWrapper>
  )
}

export class ArrayFormInput extends InputComponent<AnyFormValue> {
  public internalType = 'array'

  renderComponent(props: ArrayFormInputProps): JSX.Element {
    return <ArrayFormInputInternal {...props} />
  }
}
