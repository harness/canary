import { useCallback } from 'react'

import {
  AnyFormikValue,
  Controller,
  IInputDefinition,
  InputComponent,
  InputProps,
  RenderInputs,
  useFieldArray
} from '@harnessio/forms'
import { Button, Icon } from '@harnessio/ui/components'

import { FormField, FormItem } from '../form'
import { InputError } from './common/InputError'
import InputLabel from './common/InputLabel'
import InputWrapper from './common/InputWrapper'
import { InputType } from './types'

export type UIInputWithConfigsForArray = Omit<IInputDefinition, 'path'>

export interface ArrayInputConfig {
  inputType: InputType.array
  inputConfig: {
    input: IInputDefinition
  }
}

function ArrayInputInternal(props: InputProps<AnyFormikValue, ArrayInputConfig>): JSX.Element {
  const { readonly, path, input, factory } = props
  const { label, required, inputConfig, description } = input

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
    <InputWrapper>
      <FormField
        name={path}
        render={() => (
          <FormItem>
            <InputLabel label={label} required={required} description={description} />
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
                          <button
                            className="mt-2"
                            onClick={() => {
                              remove(idx)
                            }}
                            disabled={readonly}
                          >
                            <Icon name="trash" />
                          </button>
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
            <InputError />
          </FormItem>
        )}
      />
    </InputWrapper>
  )
}

export class ArrayInput extends InputComponent<AnyFormikValue> {
  public internalType = InputType.array

  renderComponent(props: InputProps<AnyFormikValue, ArrayInputConfig>): JSX.Element {
    return <ArrayInputInternal {...props} />
  }
}
