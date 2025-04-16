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
  useFieldArray
} from '@harnessio/forms'

import { InputError } from './common/InputError'
import { InputLabel } from './common/InputLabel'
import { InputTooltip } from './common/InputTooltip'
import { InputWrapper } from './common/InputWrapper'

export type UIInputWithConfigsForArray = Omit<IInputDefinition, 'path'>

export interface ArrayInputConfig {
  inputType: 'array'
  inputConfig: {
    input: IInputDefinition
    tooltip?: string
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
      <InputLabel label={label} required={required} description={description} />
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
                    {/* TODO: Design system: Find alternate */}
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
      <InputError path={path} />

      {inputConfig?.tooltip && <InputTooltip tooltip={inputConfig.tooltip} />}
    </InputWrapper>
  )
}

export class ArrayInput extends InputComponent<AnyFormikValue> {
  public internalType = 'array'

  renderComponent(props: InputProps<AnyFormikValue, ArrayInputConfig>): JSX.Element {
    return <ArrayInputInternal {...props} />
  }
}
