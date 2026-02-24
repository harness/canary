import { JSX, useCallback, useEffect } from 'react'

import {
  Controller,
  IInputDefinition,
  InputComponent,
  RenderInputs,
  useController,
  useFieldArray
} from '@harnessio/forms'
import { Button, IconV2 } from '@harnessio/ui/components'

import { InputLabel } from '../common/input-label'
import { InputWrapper } from '../common/input-wrapper'
import { MultiTypeSelectButton } from '../common/multi-type-select-button'
import { useMultiTypeValue } from '../common/use-multitype-value'
import { isOptionalLabelVisible, useIsOptionalLabelVisible } from '../common/utils/form-utils'
import {
  ListFormInputProps,
  ListFormInputType,
  ListFormInputValueType,
  UIInputWithConfigsForList
} from './list-form-input-types'

export function canAddNewValues(currentLength: number, limit?: number): boolean {
  // valid, positive integer limit
  const hasValidLimit = typeof limit === 'number' && !isNaN(limit) && isFinite(limit) && limit >= 1

  // If limit is missing, non-numeric, or < 1 ⇒ always allow
  if (!hasValidLimit) {
    return true
  }
  return currentLength < limit
}

function ListFormInputInternal(props: ListFormInputProps): JSX.Element {
  const { path, input, factory, readonly, disabled } = props
  const { label, inputConfig } = input

  const isGrid = inputConfig?.layout === 'grid'
  const addBtnLabel = inputConfig?.addBtnLabel || 'Add'
  // const len = inputConfig?.inputs.length
  // const frArr = new Array(len).fill('1fr', 0, len)
  const rowClass = isGrid ? `grid gap-cn-xs` : 'flex flex-col space-y-cn-md'
  const rowStyle = isGrid ? { gridTemplateColumns: `repeat(${inputConfig?.inputs.length}, 1fr) auto` } : {}
  const labelsRowStyle = isGrid ? { gridTemplateColumns: `repeat(${inputConfig?.inputs.length}, 1fr) 36px` } : {}

  // override gridTemplateColumns from inputConfig
  if (inputConfig?.gridTemplateColumns) {
    rowStyle.gridTemplateColumns = inputConfig.gridTemplateColumns
  }

  const { fields, append, remove } = useFieldArray({
    name: path
  })

  const { field } = useController({
    name: path
  })

  const getChildInputs = useCallback(
    (
      rowInputs: UIInputWithConfigsForList[],
      parentPath: string,
      idx: number,
      overrideInputProps?: (value: any) => IInputDefinition,
      overrideLabel?: (value: any) => string
    ): IInputDefinition[] => {
      return rowInputs.map(orgInput => {
        let override: Partial<IInputDefinition> = {}
        if (overrideInputProps && field.value?.[idx]) {
          override = overrideInputProps(field.value?.[idx])
        }

        const retInput = {
          ...orgInput,
          // NOTE: create absolute path using parent path, index and relative paths
          path: `${parentPath}[${idx}].${orgInput.relativePath}`,
          ...override,
          ...(overrideLabel ? { label: overrideLabel(field.value?.[idx]) } : {})
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
    []
  )

  const { inputValueType, setInputValueType, onlyFixedValueAllowed } = useMultiTypeValue({
    value: field.value,
    changeValue: field.onChange,
    allowedValueTypes: input.inputConfig?.allowedValueTypes,
    defaultValue: input.default
  })

  const optionalLabelVisible = useIsOptionalLabelVisible(input)

  useEffect(() => {
    if (inputConfig?.addOneOnInit) {
      append({})
    }
  }, [inputConfig?.addOneOnInit])

  return (
    <InputWrapper {...props} inputValueType={inputValueType} setInputValueType={setInputValueType} placement="label">
      <InputLabel
        label={label}
        showOptional={optionalLabelVisible}
        tooltip={inputConfig?.tooltip}
        suffix={
          !onlyFixedValueAllowed ? (
            <MultiTypeSelectButton.ForLabel
              inputValueType={inputValueType}
              setInputValueType={setInputValueType}
              allowedValueTypes={input.inputConfig?.allowedValueTypes}
            />
          ) : undefined
        }
      />
      {/* TODO: do we need Controller ? */}
      <Controller
        name={path}
        render={() => (
          <div>
            <div>
              {isGrid && fields.length > 0 && (
                <div className={`${rowClass} mb-cn-xs`} style={labelsRowStyle}>
                  {inputConfig?.inputs.map(rowInput => (
                    <InputLabel
                      key={rowInput.label}
                      label={rowInput.label}
                      showOptional={isOptionalLabelVisible(rowInput as any)} // TODO
                    />
                  ))}
                </div>
              )}
              <div className="space-y-cn-md flex flex-col">
                {fields.map((_item, idx) => (
                  <div key={_item.id} className={rowClass} style={rowStyle}>
                    {inputConfig?.inputs && (
                      <>
                        {getChildInputs(
                          inputConfig?.inputs as any, // TODO
                          path,
                          idx,
                          inputConfig?.overrideInputProps,
                          inputConfig?.overrideLabel
                        ).map((childInput, childIdx) => (
                          <div key={childIdx} className="min-w-0 overflow-hidden">
                            <RenderInputs items={[childInput]} factory={factory} />
                          </div>
                        ))}
                      </>
                    )}
                    {!inputConfig?.hideDelete && (
                      <Button
                        iconOnly
                        onClick={() => {
                          remove(idx)
                        }}
                        disabled={readonly || disabled}
                        tooltipProps={{ content: 'Remove' }}
                        variant="ghost"
                      >
                        <IconV2 name="trash" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
            {canAddNewValues(fields.length, inputConfig?.fieldsCountLimit) && !inputConfig?.hideAdd && (
              <Button size="sm" onClick={() => append({})} className="mt-cn-xs" disabled={readonly || disabled}>
                {addBtnLabel}
              </Button>
            )}
          </div>
        )}
      />
    </InputWrapper>
  )
}

export class ListFormInput extends InputComponent<ListFormInputValueType> {
  public internalType: ListFormInputType = 'list'

  renderComponent(props: ListFormInputProps): JSX.Element {
    return <ListFormInputInternal {...props} />
  }
}
