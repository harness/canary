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

export type UIInputWithConfigsForList<T = unknown> = Omit<IInputDefinition<T>, 'path'> & {
  relativePath: string
}

export interface ListInputConfig {
  inputType: InputType.list
  inputConfig: {
    inputs: UIInputWithConfigsForList[]
  }
}

function ListInputInternal(props: InputProps<AnyFormikValue, ListInputConfig>): JSX.Element {
  const { readonly, path, input, factory } = props
  const { label, required, inputConfig } = input

  const { fields, append, remove } = useFieldArray({
    name: path
  })

  const getChildInputs = useCallback(
    (rowInputs: UIInputWithConfigsForList[], parentPath: string, idx: number): IInputDefinition[] => {
      return rowInputs.map(orgInput => {
        const retInput = {
          ...orgInput,
          // NOTE: create absolute path using parent path, index and relative paths
          path: `${parentPath}[${idx}].${orgInput.relativePath}`
        } as IInputDefinition

        return retInput
      })
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
            <div>
              <div>
                {fields.map((_item, idx) => (
                  <div key={_item.id} style={{ display: 'flex1', alignItems: 'flex-end', columnGap: '5px' }}>
                    {inputConfig?.inputs && (
                      <RenderInputs items={getChildInputs(inputConfig?.inputs, path, idx)} factory={factory} />
                    )}
                    <div className="flex items-center">
                      <button
                        className="mt-2"
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
              <button onClick={() => append({})} className="mt-2">
                Add
              </button>
            </div>
          )}
        />
        <InputError path={path} />
      </div>
    </InputWrapper>
  )
}

export class ListInput extends InputComponent<AnyFormikValue> {
  public internalType = InputType.list

  renderComponent(props: InputProps<AnyFormikValue, ListInputConfig>): JSX.Element {
    return <ListInputInternal {...props} />
  }
}
