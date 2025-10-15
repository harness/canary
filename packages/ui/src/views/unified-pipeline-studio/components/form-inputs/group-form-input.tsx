import { useEffect, useState } from 'react'

import { Accordion, FormCaption, IconV2, Layout } from '@components/index'
import { get } from 'lodash-es'

import { InputComponent, InputProps, RenderInputs, useFormContext, type AnyFormikValue } from '@harnessio/forms'

import { InputLabel } from './common/InputLabel'

export interface GroupFormInputConfig {
  inputType: 'group'
  inputConfig?: {
    autoExpandGroups?: boolean
    /** defines behavior if error is present in any child input */
    showWarning?: 'never' | 'always' | 'closed'
  }
}

function GroupFormInputInternal(props: InputProps<AnyFormikValue, GroupFormInputConfig>): JSX.Element {
  const { input, factory, path } = props
  const { label = '', inputs = [], required, description, inputConfig = {} } = input
  const { showWarning = 'closed', autoExpandGroups } = inputConfig

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

  // NOTE: open/close accordion
  const [accordionValue, setAccordionValue] = useState<string>(autoExpandGroups ? 'group' : '')

  const onValueChange = (value: string | string[]) => {
    if (typeof value === 'string') {
      setAccordionValue(value)
    }
  }

  const allowShowWarning = showWarning === 'always' || (showWarning === 'closed' && !accordionValue)

  return (
    <Accordion.Root
      type="single"
      collapsible
      size="sm"
      onValueChange={onValueChange}
      value={accordionValue}
      indicatorPosition="right"
    >
      <Accordion.Item value={'group'}>
        <Accordion.Trigger>
          <Layout.Horizontal align="center">
            <InputLabel label={label} required={required} className="mb-0" />
            <FormCaption>{description}</FormCaption>
            {allowShowWarning && groupError ? <IconV2 name="warning-triangle" className="text-cn-danger" /> : null}
          </Layout.Horizontal>
        </Accordion.Trigger>
        <Accordion.Content className="mt-cn-md space-y-4" forceMount={forceMount}>
          <RenderInputs items={inputs} factory={factory} />
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  )
}

export class GroupFormInput extends InputComponent<AnyFormikValue> {
  public internalType = 'group'

  renderComponent(props: InputProps<AnyFormikValue, GroupFormInputConfig>): JSX.Element {
    return <GroupFormInputInternal {...props} />
  }
}
