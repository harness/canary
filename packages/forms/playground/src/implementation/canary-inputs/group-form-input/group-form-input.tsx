import { JSX, useEffect, useState } from 'react'

import { get } from 'lodash-es'

import { InputComponent, InputProps, RenderInputs, useFormContext } from '@harnessio/forms'
import { Accordion, FileExplorer, FormCaption, IconV2, Layout } from '@harnessio/ui/components'

import {
  AccordionFormInputProvider,
  useAccordionFormInputContext
} from '../accordion-form-input/accordion-form-input-context'
import { GroupFormInputConfig, GroupFormInputProps, GroupFormInputValueType } from './group-form-input-types'

function GroupFormInputInternal(props: InputProps<GroupFormInputValueType, GroupFormInputConfig>): JSX.Element {
  const { input, factory, path } = props
  const { label, inputs = [], description, inputConfig = {} } = input
  const { showWarning = 'closed', indicatorPosition, variant = 'card' } = inputConfig

  const { formState } = useFormContext()
  const [groupError, setGroupError] = useState<boolean>(false)

  useEffect(() => {
    const error = get(formState.errors, path)
    if (error) {
      setGroupError(true)
    }
    inputs.forEach(input => {
      const errorAtInput = get(formState.errors, input.path)
      if (errorAtInput) {
        setGroupError(true)
      }
    })
  }, [formState?.errors])

  // TODO: WORKAROUND/POC
  const [forceMount, setForceMount] = useState<true | undefined>(true)
  useEffect(() => {
    setForceMount(undefined)
  }, [])

  const { optionalVisibilityState, setAccordionValue, accordionValue } = useAccordionFormInputContext()

  const allowShowWarning = showWarning === 'always' || (showWarning === 'closed' && !accordionValue.includes(path))

  const suffix = (
    <Layout.Horizontal gap="xs">
      {optionalVisibilityState.get(path) ? 'Optional' : null}
      {allowShowWarning && groupError ? <IconV2 name="warning-triangle-solid" className="text-cn-danger" /> : null}
    </Layout.Horizontal>
  )

  return variant === 'card' ? (
    <Accordion.Root
      type="multiple"
      size="md"
      variant="card"
      onValueChange={(value: string | string[]) => {
        setAccordionValue(typeof value === 'string' ? [value] : value)
      }}
      value={accordionValue}
      indicatorPosition={indicatorPosition ?? 'left'}
    >
      <Accordion.Item value={path}>
        <Accordion.Trigger suffix={suffix}>{label}</Accordion.Trigger>
        <Accordion.Content forceMount={forceMount}>
          <Layout.Vertical gap="md">
            <FormCaption>{description}</FormCaption>
            <RenderInputs items={inputs} factory={factory} />
          </Layout.Vertical>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  ) : (
    <FileExplorer.Root
      value={accordionValue}
      onValueChange={(value: string | string[]) => {
        setAccordionValue(typeof value === 'string' ? [value] : value)
      }}
    >
      <FileExplorer.FolderItem
        hideIcon={true}
        key={path}
        value={path}
        level={0}
        content={
          <div className="pl-cn-4xs">
            <RenderInputs items={inputs} factory={factory} />
          </div>
        }
      >
        {label} ({inputs.length})
      </FileExplorer.FolderItem>
    </FileExplorer.Root>
  )
}

export class GroupFormInput extends InputComponent<GroupFormInputValueType> {
  public internalType = 'group'

  renderComponent(props: GroupFormInputProps): JSX.Element {
    return (
      <AccordionFormInputProvider inputs={[props.input]}>
        <GroupFormInputInternal {...props} />
      </AccordionFormInputProvider>
    )
  }
}
