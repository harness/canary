import { useEffect, useState } from 'react'

import { Accordion, IconV2 } from '@components/index'
import { get } from 'lodash-es'

import {
  IInputDefinition,
  InputComponent,
  InputProps,
  RenderInputs,
  useFormContext,
  type AnyFormikValue
} from '@harnessio/forms'

import { InputLabel } from './common/InputLabel'
import { Layout } from './common/Layout'

function getAccordionId(input: IInputDefinition) {
  return `${input.path}_${input.label}`
}

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
  const { input, factory } = props
  const { inputs = [], inputConfig = {} } = input
  const { showWarning = 'closed', autoExpandGroups } = inputConfig

  const { formState } = useFormContext()
  const [errorPerGroup, setErrorPerGroup] = useState<boolean[]>([])

  useEffect(() => {
    // TODO: for nested group/list/array errors are not collected
    const errors: boolean[] = []

    inputs.forEach((groupInput, idx) => {
      groupInput.inputs?.forEach(chidInput => {
        if (errors[idx]) return

        const childError = get(formState.errors, chidInput.path)
        errors[idx] = !!childError
      })
    })

    setErrorPerGroup(errors)
  }, [formState?.errors, inputs])

  // TODO: WORKAROUND/POC
  const [forceMount, setForceMount] = useState<true | undefined>(true)
  useEffect(() => {
    setForceMount(undefined)
  }, [])

  const [accordionValue, setAccordionValue] = useState<string[]>(
    autoExpandGroups ? inputs.map(input => getAccordionId(input)) : []
  )

  return (
    <Accordion.Root
      type="multiple"
      onValueChange={(value: string | string[]) => {
        setAccordionValue(typeof value === 'string' ? [value] : value)
      }}
      value={accordionValue}
      indicatorPosition="left"
    >
      {inputs.map((childInput, idx) => {
        const accId = getAccordionId(childInput)

        const allowShowWarning =
          showWarning === 'always' || (showWarning === 'closed' && !accordionValue.includes(accId))

        return (
          <Accordion.Item value={accId} key={getAccordionId(childInput)}>
            {childInput.label && (
              <Accordion.Trigger>
                <Layout.Horizontal className="items-center">
                  <InputLabel
                    label={childInput.label}
                    required={childInput.required}
                    className="mb-0 flex grow cursor-[inherit] justify-between"
                  />
                  {allowShowWarning && errorPerGroup[idx] ? (
                    <IconV2 name="warning-triangle" className="text-cn-foreground-danger" />
                  ) : null}
                </Layout.Horizontal>
              </Accordion.Trigger>
            )}
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

  renderComponent(props: AccordionFormInputProp): JSX.Element {
    return <AccordionFormInputInternal {...props} />
  }
}
