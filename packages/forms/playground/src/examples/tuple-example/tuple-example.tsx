import { useState } from 'react'

import { AnyFormValue, RenderForm, RootForm, useZodValidationResolver } from '@harnessio/forms'
import { Button, Layout } from '@harnessio/ui/components'

import { FormEvents } from '../../helpers/form-events'
import { FormStatus } from '../../helpers/form-status'
import { FormUpdate } from '../../helpers/form-update'
import inputComponentFactory from '../../implementation/factory/factory'
import { formDefinition } from './form-definition'

const initialFormValues = {
  // Tuple - fixed positions (0, 1)
  coordinates: [10, 20],

  // Tuple with nested objects - fixed positions (0, 1)
  servers: [
    { name: 'Primary Server', url: 'https://primary.example.com' },
    { name: 'Backup Server', url: 'https://backup.example.com' }
  ],

  // Tuple with fixed owners - different schemas per position
  owners: [
    { name: 'Alice Johnson', email: 'alice@company.com' },
    { name: 'Bob Williams', email: 'bob@company.com' },
    { name: 'Charlie Davis', role: 'tech_lead' }
  ],

  // Tuple with sparse indices - only positions 0 and 5 are validated
  priorities: ['Critical', null, null, null, null, 'Low'],

  // Dynamic array - can add/remove items
  tags: ['frontend', 'backend'],

  // Dynamic list - can add/remove items
  contributors: [
    { name: 'John Doe', email: 'john@example.com' },
    { name: 'Jane Smith', email: 'jane@example.com' }
  ]
}

function TupleExample() {
  const [formState, setFormState] = useState<{ isValid?: boolean; isSubmitted?: boolean }>({})
  const [logs, setLogs] = useState<{ label: string; log: string }[]>([])
  const [formKey, setFormKey] = useState(0)
  const [defaultValues, setDefaultValues] = useState(initialFormValues)

  const updateValues = (newValues: any) => {
    setDefaultValues(prev => ({ ...prev, ...newValues }))
  }

  const resetFormToInitial = () => {
    setFormKey(prev => prev + 1)
    setDefaultValues(initialFormValues)
  }

  const resetFormToEmpty = () => {
    setFormKey(prev => prev + 1)
    setDefaultValues({} as any)
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
      {/* Column 1 - Form */}
      <div className="border-border bg-background p-cn-md rounded-cn-6 border" style={{ width: '500px' }}>
        <RootForm
          key={formKey}
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
              <Layout.Horizontal gap="md" className="mt-2">
                <Button onClick={() => rootForm.submitForm()} className="self-start">
                  Submit
                </Button>
                <Button onClick={resetFormToInitial} variant="secondary" className="self-start">
                  Reset Form
                </Button>
                <Button onClick={resetFormToEmpty} variant="outline" className="self-start">
                  Reset to Empty
                </Button>
              </Layout.Horizontal>
            </Layout.Vertical>
          )}
        </RootForm>
      </div>

      {/* Column 2 - Form Status */}
      <div className="w-48">
        <FormStatus formState={formState} />
      </div>

      {/* Column 3 - Test Updates */}
      <Layout.Vertical gap="sm" className="w-96">
        <div className="text-foreground-1 mb-cn-xs text-sm font-semibold">Test Updates</div>
        <FormUpdate
          onUpdate={updateValues}
          values={{
            coordinates: [100, 200],
            servers: [
              { name: 'Updated Primary', url: 'https://new-primary.com' },
              { name: 'Updated Backup', url: 'https://new-backup.com' }
            ],
            owners: [
              { name: 'Eve Anderson', email: 'eve@newcompany.com' },
              { name: 'Frank Miller', email: 'frank@newcompany.com' },
              { name: 'Grace Lee', role: 'architect' }
            ],
            contributors: [
              { name: 'Alice Johnson', email: 'alice@example.com' },
              { name: 'Bob Williams', email: 'bob@example.com' }
            ]
          }}
          label="Update tuple values (valid)"
        />
        <FormUpdate
          onUpdate={updateValues}
          values={{
            coordinates: [-10, 20],
            servers: [
              { name: 'Primary', url: 'invalid-url' },
              { name: 'Backup', url: 'https://backup.com' }
            ],
            owners: [
              { name: 'X', email: 'not-an-email' },
              { name: 'Valid Name', email: 'valid@email.com' },
              { name: 'Tech', role: 'developer' }
            ]
          }}
          label="Update tuple values (invalid)"
        />
        <FormUpdate
          onUpdate={updateValues}
          values={{
            tags: ['ab', 'valid-tag'],
            contributors: [{ name: 'Test User', email: 'invalid-email' }]
          }}
          label="Update array/list (invalid)"
        />
      </Layout.Vertical>

      {/* Column 4 - Event Logs */}
      <div className="min-w-0 flex-1">
        <FormEvents logs={logs} onClearLogs={() => setLogs([])} />
      </div>
    </Layout.Horizontal>
  )
}

export default TupleExample
