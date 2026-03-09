import { useCallback } from 'react'

import { Button } from '@harnessio/ui/components'
import { IconV2 } from '@harnessio/ui/components'

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

export type UIInputWithConfigsForList<T = unknown> = Omit<IInputDefinition<T>, 'path'> & {
  relativePath: string
}

export interface ListFormInputConfig extends RuntimeInputConfig {
  inputs: UIInputWithConfigsForList[]
  layout?: 'grid' | 'default'
  tooltip?: string
}

export type ListFormInputDefinition = IInputDefinition<ListFormInputConfig, AnyFormValue, 'list'>

type ListFormInputProps = InputProps<AnyFormValue, ListFormInputConfig>

function ListFormInputInternal(props: ListFormInputProps): JSX.Element {
  const { readonly, path, input, factory } = props
  const { label, required, inputConfig, description } = input

  const isGrid = inputConfig?.layout === 'grid'
  // const len = inputConfig?.inputs.length
  // const frArr = new Array(len).fill('1fr', 0, len)
  const rowClass = isGrid ? `grid gap-cn-xs` : 'flex flex-col space-y-cn-md'
  const rowStyle = isGrid ? { gridTemplateColumns: `repeat(${inputConfig?.inputs.length}, 1fr) auto` } : {}

  const { fields, append, remove } = useFieldArray({
    name: path
  })

  const { getFieldState, formState } = useFormContext()
  const fieldState = getFieldState(path, formState)
  const { error } = fieldState

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
    <InputWrapper {...props}>
      <InputLabel label={label} required={required} />
      {/* TODO: do we need Controller ? */}
      <Controller
        name={path}
        render={() => (
          <div>
            <div>
              {isGrid && fields.length > 0 && (
                <div className={rowClass} style={rowStyle}>
                  {inputConfig?.inputs.map(rowInput => (
                    <InputLabel key={rowInput.label} label={rowInput.label} required={rowInput.required} />
                  ))}
                </div>
              )}
              <div className="space-y-cn-xs flex flex-col">
                {fields.map((_item, idx) => (
                  <div key={_item.id} className={rowClass} style={rowStyle}>
                    {inputConfig?.inputs && (
                      <RenderInputs items={getChildInputs(inputConfig?.inputs, path, idx)} factory={factory} />
                    )}
                    <div className="flex items-center">
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
                  </div>
                ))}
              </div>
            </div>
            <Button size="sm" onClick={() => append({})} className="mt-cn-xs">
              Add
            </Button>
          </div>
        )}
      />
      <InputCaption error={error?.message} caption={description} />
    </InputWrapper>
  )
}

export class ListFormInput extends InputComponent<AnyFormValue> {
  public internalType = 'list'

  renderComponent(props: ListFormInputProps): JSX.Element {
    return <ListFormInputInternal {...props} />
  }
}
