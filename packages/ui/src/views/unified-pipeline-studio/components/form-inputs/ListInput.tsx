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
import InputLabel from './common/InputLabel'
import InputWrapper from './common/InputWrapper'
import { InputType } from './types'

export type UIInputWithConfigsForList<T = unknown> = Omit<IInputDefinition<T>, 'path'> & {
  relativePath: string
}

export interface ListInputConfig {
  inputType: InputType.list
  inputConfig: {
    inputs: UIInputWithConfigsForList[]
    layout?: 'grid' | 'default'
  }
}

function ListInputInternal(props: InputProps<AnyFormikValue, ListInputConfig>): JSX.Element {
  const { readonly, path, input, factory } = props
  const { label, required, inputConfig, description } = input

  const isGrid = inputConfig?.layout === 'grid'
  // const len = inputConfig?.inputs.length
  // const frArr = new Array(len).fill('1fr', 0, len)
  const rowClass = isGrid ? `grid gap-2` : 'flex flex-col space-y-4'
  const rowStyle = isGrid ? { gridTemplateColumns: `repeat(${inputConfig?.inputs.length}, 1fr) auto` } : {}

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

        if (isGrid) {
          // label is rendered in header
          delete retInput.label
          // required is only used for optional label (validation is part of the root formik)
          retInput.required = true
        }

        return retInput
      })
    },
    [inputConfig?.layout]
  )

  return (
    <InputWrapper>
      <InputLabel label={label} required={required} description={description} />
      {/* TODO: do we need Controller ? */}
      <Controller
        name={path}
        render={() => (
          <div>
            <div>
              {isGrid && fields.length > 0 && (
                <div className={rowClass} style={rowStyle}>
                  {inputConfig?.inputs.map(rowInput => (
                    <InputLabel
                      key={rowInput.label}
                      label={rowInput.label}
                      required={rowInput.required}
                      description={rowInput.description}
                    />
                  ))}
                </div>
              )}
              <div className="flex flex-col space-y-2">
                {fields.map((_item, idx) => (
                  <div key={_item.id} className={rowClass} style={rowStyle}>
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
                        <Icon name="trash" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <Button size="sm" onClick={() => append({})} className="mt-2">
              Add
            </Button>
          </div>
        )}
      />
      <InputError path={path} />
    </InputWrapper>
  )
}

export class ListInput extends InputComponent<AnyFormikValue> {
  public internalType = InputType.list

  renderComponent(props: InputProps<AnyFormikValue, ListInputConfig>): JSX.Element {
    return <ListInputInternal {...props} />
  }
}
