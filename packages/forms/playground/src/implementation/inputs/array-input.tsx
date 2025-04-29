import { useCallback } from 'react'

import {
  AnyFormikValue,
  Controller,
  IInputDefinition,
  InputComponent,
  InputProps,
  RenderInputs,
  useFieldArray
} from '../../../../src'
import { InputError } from './common/input-errror'
import InputLabel from './common/input-label'
import InputWrapper from './common/input-wrapper'
import { InputType } from './common/types'

export type UIInputWithConfigsForArray = Omit<IInputDefinition, 'path'>

export interface ArrayInputConfig {
  inputType: InputType.array
  inputConfig: {
    input: IInputDefinition
  }
}

function ArrayInputInternal(props: InputProps<AnyFormikValue, ArrayInputConfig>): JSX.Element {
  const { readonly, path, input, factory } = props
  const { label, required, inputConfig } = input

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
    <InputWrapper {...props}>
      <div style={{ padding: '10px', background: 'rgba(0,0,0,0.05)' }}>
        <InputLabel label={label} required={required} />
        {/* TODO: do we need Controller ? */}
        <Controller
          name={path}
          render={() => (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div>
                {fields.map((item, idx) => (
                  <div key={item.id} style={{ display: 'flex', alignItems: 'flex-end', columnGap: '5px' }}>
                    {inputConfig?.input && (
                      <RenderInputs items={getChildInputs(inputConfig?.input, path, idx)} factory={factory} />
                    )}
                    <div>
                      <button
                        onClick={() => {
                          remove(idx)
                        }}
                        disabled={readonly}
                      >
                        X
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div>
                <button onClick={() => append(input.default ?? undefined)}>Add</button>
              </div>
            </div>
          )}
        />
        <InputError path={path} />
      </div>
    </InputWrapper>
  )
}

export class ArrayInput extends InputComponent<AnyFormikValue> {
  public internalType = InputType.array

  renderComponent(props: InputProps<AnyFormikValue, ArrayInputConfig>): JSX.Element {
    return <ArrayInputInternal {...props} />
  }
}
