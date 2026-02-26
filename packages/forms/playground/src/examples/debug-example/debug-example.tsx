import { useState } from 'react'

import { AnyFormValue, RenderForm, RootForm, useZodValidationResolver } from '@harnessio/forms'
import { Button, Layout } from '@harnessio/ui/components'

import { FormEvents } from '../../helpers/form-events'
import { FormStatus } from '../../helpers/form-status'
import { FormUpdate } from '../../helpers/form-update'
import inputComponentFactory from '../../implementation/factory/factory'
import { formDefinition } from './form-definition'

function DebugExample() {
  const [formState, setFormState] = useState<{ isValid?: boolean; isSubmitted?: boolean }>({})
  const [logs, setLogs] = useState<{ label: string; log: string }[]>([])
  const [defaultValues, setDefaultValues] = useState({ input1: '11' })

  const updateValues = (newValues: any) => {
    setDefaultValues(prev => ({ ...prev, ...newValues }))
  }

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

  const resolver = useZodValidationResolver(formDefinition)

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
        <FormUpdate onUpdate={updateValues} values={{ input1: 'Abcdefgh' }} label="Set invalid value" />
        <FormUpdate onUpdate={updateValues} values={{ input1: '123456' }} label="Set valid value" />
      </Layout.Vertical>

      {/* Column 4 */}
      <div className="min-w-0 flex-1">
        <FormEvents logs={logs} onClearLogs={() => setLogs([])} />
      </div>
    </Layout.Horizontal>
  )
}

export default DebugExample
