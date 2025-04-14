import { useState } from 'react'

import { RenderForm, RootForm, useZodValidationResolver } from '../../../../src'
import { UpdateValues } from '../../helpers/update-values-btn'
import inputComponentFactory from '../../implementation/factory/factory'
import { formDefinition } from './form-definition'

function DebugExample() {
  const [formState, setFormState] = useState<{ isValid?: boolean; isSubmitted?: boolean }>({})
  const [logs, setLogs] = useState<{ label: string; log: string }[]>([])
  const [defaultValues, setDefaultValues] = useState({ input1: '11' })

  const onSubmit = values => {
    addLog('SUBMIT', values)
  }

  const onValuesChange = values => {
    addLog('VALUES CHANGED', values)
  }

  const onValidationChange = formState => {
    setFormState(formState)
    addLog('VALIDATION', formState)
  }

  const addLog = (label: string, log: string | object) => {
    const logString = typeof log === 'string' ? log : JSON.stringify(log, undefined, 2)
    setLogs([...logs, { label, log: logString }])
  }

  const resolver = useZodValidationResolver(formDefinition)

  return (
    <div style={{ display: 'flex', gap: '50px', alignItems: 'flex-start' }}>
      <RootForm
        defaultValues={defaultValues}
        onSubmit={onSubmit}
        resolver={resolver}
        mode={'onSubmit'}
        onValuesChange={onValuesChange}
        onValidationChange={onValidationChange}
      >
        {rootForm => (
          <div style={{ border: '1px solid lightgray', padding: '10px' }}>
            <RenderForm factory={inputComponentFactory} inputs={formDefinition} />
            <button onClick={() => rootForm.submitForm()} style={{ marginTop: '10px' }}>
              Submit
            </button>
          </div>
        )}
      </RootForm>

      <div style={{ width: '200px' }}>
        <div>
          Valid:{' '}
          {formState.isValid ? (
            <span style={{ color: 'green', fontWeight: 'bold' }}>Yes</span>
          ) : (
            <span style={{ color: 'red', fontWeight: 'bold' }}>No</span>
          )}
        </div>
        <div>
          Submitted:{' '}
          {formState.isSubmitted ? (
            <span style={{ color: 'green', fontWeight: 'bold' }}>Yes</span>
          ) : (
            <span style={{ color: 'red', fontWeight: 'bold' }}>No</span>
          )}
        </div>
      </div>

      <div style={{ width: '400px' }}>
        <UpdateValues onUpdate={setDefaultValues} values={{ input1: 'Abcdefgh' }} label="Set invalid value" />
        <UpdateValues onUpdate={setDefaultValues} values={{ input1: '123456' }} label="Set valid value" />
      </div>

      <div style={{ flexGrow: '1' }}>
        <div style={{ border: '1px solid lightgray', padding: '10px' }}>
          <button onClick={() => setLogs([])}>Clear logs</button>

          {logs.map(log => (
            <>
              <pre style={{ background: '#EEE' }}>{log.label}</pre>
              <pre>{log.log}</pre>
            </>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DebugExample
