import { useState } from 'react'

import { AnyFormValue, collectDefaultValues, RenderForm, RootForm, useZodValidationResolver } from '@harnessio/forms'
import { Button, Layout } from '@harnessio/ui/components'

import { FormEvents } from '../../helpers/form-events'
import { FormStatus } from '../../helpers/form-status'
import { FormUpdate } from '../../helpers/form-update'
import inputComponentFactory from '../../implementation/factory/factory'
import { formDefinition } from './form-definition'
import { FormMetadata } from './types/types'

function RuntimeExample() {
  const [formState, setFormState] = useState<{ isValid?: boolean; isSubmitted?: boolean }>({})
  const [logs, setLogs] = useState<{ label: string; log: string }[]>([])
  const [defaultValues, setDefaultValues] = useState({
    ...collectDefaultValues(formDefinition),
    input1: '<+input>'
  })

  const onSubmit = (values: AnyFormValue) => {
    addLog('SUBMIT', values)
  }

  const onValuesChange = (values: AnyFormValue) => {
    addLog('VALUES CHANGED', values)
  }

  const onValidationChange = (formState: { isValid: boolean; isSubmitted: boolean }) => {
    setFormState(formState)
    addLog('VALIDATION', formState)
  }

  const addLog = (label: string, log: string | object) => {
    const logString = typeof log === 'string' ? log : JSON.stringify(log, undefined, 2)
    setLogs([...logs, { label, log: logString }])
  }

  const resolver = useZodValidationResolver(formDefinition, {
    validationConfig: {
      globalValidation: (value, _input, _metadata) => {
        if (typeof value === 'string' && value.indexOf('<+input') !== -1) {
          // TODO: validate runtime input value here
          return { continue: false }
        }
        return { continue: true }
      }
    }
  })

  const metadata: FormMetadata = {
    prop1: '1',
    prop2: '2'
  }

  return (
    <Layout.Horizontal gap="xl" align="start">
      {/* Column 1 */}
      <div className="border-border bg-background p-cn-md rounded-cn-6 border" style={{ width: '400px' }}>
        <RootForm
          defaultValues={defaultValues}
          onSubmit={onSubmit}
          resolver={resolver}
          mode={'onSubmit'}
          onValuesChange={onValuesChange}
          onValidationChange={onValidationChange}
          metadata={metadata}
          onInputRenderError={error => {
            // eslint-disable-next-line no-console
            console.error('INPUT RENDER ERROR', error)
          }}
        >
          {rootForm => (
            <Layout.Vertical gap="lg">
              <RenderForm factory={inputComponentFactory} inputs={formDefinition} className="space-y-cn-md" />
              <Button onClick={() => rootForm.submitForm()} className="mt-2 self-start">
                Submit
              </Button>
            </Layout.Vertical>
          )}
        </RootForm>
      </div>

      {/* Column 2 */}
      <div className="w-48">
        <FormStatus formState={formState} />
      </div>

      {/* Column 3 */}
      <Layout.Vertical gap="sm" className="w-96">
        <FormUpdate onUpdate={setDefaultValues} values={{ input1: 'Abcdefgh' }} label="Set invalid value" />
        <FormUpdate onUpdate={setDefaultValues} values={{ input1: '123456' }} label="Set valid value" />
        <FormUpdate onUpdate={setDefaultValues} values={{ input1: '<+inputs.qwe>' }} label="Set runtime" />
      </Layout.Vertical>

      {/* Column 4 */}
      <div className="min-w-0 flex-1">
        <FormEvents logs={logs} onClearLogs={() => setLogs([])} />
      </div>
    </Layout.Horizontal>
  )
}

export default RuntimeExample
