import { JSX, useEffect, useState } from 'react'

import { get } from 'lodash-es'

import { IInputDefinition, InputComponent, RenderInputs, useFormContext } from '@harnessio/forms'
import { Accordion, FormCaption, IconV2, Layout } from '@harnessio/ui/components'

import { AccordionFormInputProvider, useAccordionFormInputContext } from './accordion-form-input-context'
import {
  AccordionFormInputProp,
  AccordionFormInputType,
  AccordionFormInputValueType
} from './accordion-form-input-types'

function getAccordionId(input: IInputDefinition) {
  return `${input.path}`
}

function AccordionFormInputInternal(props: AccordionFormInputProp): JSX.Element {
  const { input, factory } = props
  const { inputs = [], inputConfig = {} } = input
  const { showWarning = 'closed', indicatorPosition } = inputConfig

  const { formState } = useFormContext()
  const [errorPerGroup, setErrorPerGroup] = useState<boolean[]>([])

  const { optionalVisibilityState, setAccordionValue, accordionValue } = useAccordionFormInputContext()

  // collect error per group
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

  return (
    <Accordion.Root
      variant="card"
      size="md"
      type="multiple"
      onValueChange={(value: string | string[]) => {
        setAccordionValue(typeof value === 'string' ? [value] : value)
      }}
      value={accordionValue}
      indicatorPosition={indicatorPosition ?? 'left'}
    >
      {inputs.map((childInput, idx) => {
        const accId = getAccordionId(childInput)

        const allowShowWarning =
          showWarning === 'always' || (showWarning === 'closed' && !accordionValue.includes(accId))

        const suffix = (
          <Layout.Horizontal gap="xs">
            {optionalVisibilityState.get(childInput.path) ? 'Optional' : null}
            {allowShowWarning && errorPerGroup[idx] ? (
              <IconV2 name="warning-triangle-solid" className="text-cn-danger" />
            ) : null}
          </Layout.Horizontal>
        )

        return (
          <Accordion.Item value={accId} key={getAccordionId(childInput)}>
            {childInput.label && <Accordion.Trigger suffix={suffix}>{childInput.label}</Accordion.Trigger>}
            <Accordion.Content forceMount={forceMount}>
              <Layout.Vertical gap="xl">
                <FormCaption>{childInput.description}</FormCaption>
                <RenderInputs items={childInput.inputs ?? []} factory={factory} />
              </Layout.Vertical>
            </Accordion.Content>
          </Accordion.Item>
        )
      })}
    </Accordion.Root>
  )
}

export class AccordionFormInput extends InputComponent<AccordionFormInputValueType> {
  public internalType: AccordionFormInputType = 'accordion'

  renderComponent(props: AccordionFormInputProp): JSX.Element {
    return (
      <AccordionFormInputProvider inputs={props.input?.inputs ?? []}>
        <AccordionFormInputInternal {...props} />
      </AccordionFormInputProvider>
    )
  }
}
