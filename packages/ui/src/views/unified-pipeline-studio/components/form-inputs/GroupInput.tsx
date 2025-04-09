import { useEffect, useState } from 'react'

import { Icon } from '@components/icon'
import { Accordion } from '@components/index'
import { get } from 'lodash-es'

import { InputComponent, InputProps, RenderInputs, useFormContext, type AnyFormikValue } from '@harnessio/forms'

import { InputLabel } from './common/InputLabel'
import { Layout } from './common/Layout'

export interface GroupInputConfig {
  inputType: 'group'
}

function GroupInputInternal(props: InputProps<AnyFormikValue>): JSX.Element {
  const { input, factory, path, autoExpandGroup } = props
  const { label = '', inputs = [], required, description } = input

  const { formState } = useFormContext()
  const error = get(formState.errors, path)

  // NOTE: consider: if group is open hide error as it will be visible in the form
  //const [isOpen, setIsOpen] = useState<boolean>(false)

  // TODO: WORKAROUND/POC
  const [forceMount, setForceMount] = useState<true | undefined>(true)
  useEffect(() => {
    setForceMount(undefined)
  }, [])

  const [value, setValue] = useState<string>(autoExpandGroup ? 'group' : '')

  const onValueChange = (value: string | string[]) => {
    if (typeof value === 'string') {
      setValue(value)
    }
  }

  return (
    <Accordion.Root
      type="single"
      collapsible
      className="w-full bg-cn-background-softgray/30 px-3"
      onValueChange={onValueChange}
      value={value}
    >
      <Accordion.Item value={'group'} className="border-b-0">
        <Accordion.Trigger>
          <Layout.Horizontal className="items-center">
            <InputLabel label={label} required={required} description={description} className="mb-0" />
            {error && <Icon name="triangle-warning" className="text-cn-foreground-danger" />}
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

  renderComponent(props: InputProps<AnyFormikValue>): JSX.Element {
    return <GroupInputInternal {...props} />
  }
}
