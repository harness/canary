import { useEffect, useState } from 'react'

import { Icon } from '@components/icon'
import { Accordion } from '@components/index'
import { get } from 'lodash-es'

import { InputComponent, InputProps, RenderInputs, useFormContext, type AnyFormikValue } from '@harnessio/forms'

import { InputLabel } from './common/InputLabel'
import { Layout } from './common/Layout'

export interface AccordionFormInputConfig {
  inputType: 'accordion'
  inputConfig?: {
    autoExpandGroups?: boolean
    /** defines default behavior for accordion items if error is present in any child input */
    showWarning?: 'never' | 'always' | 'closed'
  }
}

type AccordionFormInputProp = InputProps<AnyFormikValue, AccordionFormInputConfig>
function AccordionFormInputInternal(props: AccordionFormInputProp): JSX.Element {
  const { input, factory, path } = props
  const { inputs = [], inputConfig = {} } = input
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
  const [accordionValue, setAccordionValue] = useState<string[]>(
    autoExpandGroups ? inputs.map(input => input.path + '_' + input.label) : []
  )

  const onValueChange = (value: string | string[]) => {
    setAccordionValue(typeof value === 'string' ? [value] : value)
  }

  return (
    <Accordion.Root type="multiple" onValueChange={onValueChange} value={accordionValue}>
      {inputs.map(childInput => {
        const allowShowWarning =
          showWarning === 'always' ||
          (showWarning === 'closed' && accordionValue.includes(childInput.path + '_' + childInput.label))

        return (
          <Accordion.Item value={childInput.path + '_' + childInput.label}>
            <Accordion.Trigger>
              <Layout.Horizontal className="items-center">
                <InputLabel
                  label={childInput.label}
                  required={childInput.required}
                  description={childInput.description}
                  className="mb-0"
                />
                {allowShowWarning && groupError ? (
                  <Icon name="triangle-warning" className="text-cn-foreground-danger" />
                ) : null}
              </Layout.Horizontal>
            </Accordion.Trigger>
            <Accordion.Content className="space-y-4" forceMount={forceMount}>
              <RenderInputs items={childInput.inputs ?? []} factory={factory} />
            </Accordion.Content>
          </Accordion.Item>
        )
      })}
    </Accordion.Root>
  )
}

export class AccordionFormInput extends InputComponent<AnyFormikValue> {
  public internalType = 'accordion'

  constructor() {
    super()
  }

  renderComponent(props: AccordionFormInputProp): JSX.Element {
    return <AccordionFormInputInternal {...props} />
  }
}
