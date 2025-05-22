import { useEffect, useState } from 'react'

import { Icon } from '@components/icon'
import { Accordion } from '@components/index'
import { get } from 'lodash-es'

import { InputComponent, InputProps, RenderInputs, useFormContext, type AnyFormikValue } from '@harnessio/forms'

import { InputLabel } from './common/InputLabel'
import { Layout } from './common/Layout'

export interface GroupInputConfig {
  inputType: 'group'
  inputConfig?: {
    autoExpandGroups?: boolean
    /** defines behavior if error is present in any child input */
    showWarning?: 'never' | 'always' | 'closed'
  }
}

function GroupInputInternal(props: InputProps<AnyFormikValue, GroupInputConfig>): JSX.Element {
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
      className="w-full bg-cn-background-softgray/30 px-3"
      onValueChange={onValueChange}
      value={accordionValue}
    >
      <Accordion.Item value={'group'} className="border-b-0">
        <Accordion.Trigger>
          <Layout.Horizontal className="items-center">
            <InputLabel label={label} required={required} description={description} className="mb-0" />
            {allowShowWarning && groupError ? (
              <Icon name="triangle-warning" className="text-cn-foreground-danger" />
            ) : null}
          </Layout.Horizontal>
        </Accordion.Trigger>
        <Accordion.Content className="mt-4 space-y-4" forceMount={forceMount}>
          <RenderInputs items={inputs} factory={factory} />
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  )
}

export class GroupInput extends InputComponent<AnyFormikValue> {
  public internalType = 'group'

  constructor() {
    super()
  }

  renderComponent(props: InputProps<AnyFormikValue, GroupInputConfig>): JSX.Element {
    return <GroupInputInternal {...props} />
  }
}
