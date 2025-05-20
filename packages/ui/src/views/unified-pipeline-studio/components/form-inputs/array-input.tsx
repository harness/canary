import { useCallback } from 'react'

import { Button } from '@components/button'
import { Icon } from '@components/icon'

import {
  AnyFormikValue,
  Controller,
  IInputDefinition,
  InputComponent,
  InputProps,
  RenderInputs,
  useFieldArray,
  useFormContext
} from '@harnessio/forms'

import { InputCaption } from './common/InputCaption'
import { InputLabel } from './common/InputLabel'
import { InputWrapper } from './common/InputWrapper'
import { RuntimeInputConfig } from './types/types'

export type UIInputWithConfigsForArray = Omit<IInputDefinition, 'path'>

export interface ArrayFormInputConfig {
  inputType: 'array'
  inputConfig: {
    input: IInputDefinition
    tooltip?: string
  } & RuntimeInputConfig
}

type ArrayFormInputProps = InputProps<AnyFormikValue, ArrayFormInputConfig>

function ArrayFormInputInternal(props: ArrayFormInputProps): JSX.Element {
  const { readonly, path, input, factory } = props
  const { label, required, inputConfig, description } = input

  const { fields, append, remove } = useFieldArray({
    name: path
  })

  const { getFieldState, formState } = useFormContext()
  const fieldState = getFieldState(path, formState)
  const { error } = fieldState

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
    <InputWrapper {...props}>
      <InputLabel label={label} required={required} />
      {/* TODO: do we need Controller ? */}
      <Controller
        name={path}
        render={() => (
          <div className="flex flex-col">
            <div>
              {fields.map((item, idx) => (
                <div key={item.id} className="flex items-end space-x-2">
                  {inputConfig?.input && (
                    <RenderInputs items={getChildInputs(inputConfig?.input, path, idx)} factory={factory} />
                  )}
                  <div>
                    <Button
                      iconOnly
                      className="mt-2"
                      onClick={() => {
                        remove(idx)
                      }}
                      disabled={readonly}
                    >
                      <Icon name="trash" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <div>
              <Button size="sm" onClick={() => append(input.default ?? undefined)} className="mt-2">
                Add
              </Button>
            </div>
          </div>
        )}
      />
      <InputCaption error={error?.message} caption={description} />
    </InputWrapper>
  )
}

export class ArrayFormInput extends InputComponent<AnyFormikValue> {
  public internalType = 'array'

  renderComponent(props: ArrayFormInputProps): JSX.Element {
    return <ArrayFormInputInternal {...props} />
  }
}
