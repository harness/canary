import { useCallback } from 'react'

import { Button } from '@components/button'
import { IconV2 } from '@components/icon-v2'

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

import { InputCaption } from './common/InputCaption'
import { InputLabel } from './common/InputLabel'
import { InputWrapper } from './common/InputWrapper'
import { RuntimeInputConfig } from './types/types'

export type UIInputWithConfigsForArray = Omit<IInputDefinition, 'path'>

export interface ArrayFormInputConfig extends RuntimeInputConfig {
  input: IInputDefinition
  tooltip?: string
}

export type ArrayFormInputDefinition = IInputDefinition<ArrayFormInputConfig, AnyFormValue, 'array'>

type ArrayFormInputProps = InputProps<AnyFormValue, ArrayFormInputConfig>

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
                <div key={item.id} className="flex items-end space-x-cn-xs">
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
              <Button size="sm" onClick={() => append(input.default ?? undefined)} className="mt-cn-xs">
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

export class ArrayFormInput extends InputComponent<AnyFormValue> {
  public internalType = 'array'

  renderComponent(props: ArrayFormInputProps): JSX.Element {
    return <ArrayFormInputInternal {...props} />
  }
}
