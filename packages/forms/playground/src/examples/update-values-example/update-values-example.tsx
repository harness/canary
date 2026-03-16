import { useMemo, useRef, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'

import { AnyFormValue, collectDefaultValues, RenderForm, RootForm, useZodValidationResolver } from '@harnessio/forms'
import { Button, Card, Layout, Text } from '@harnessio/ui/components'

import { FormEvents } from '../../helpers/form-events'
import { FormStatus } from '../../helpers/form-status'
import inputComponentFactory from '../../implementation/factory/factory'
import { formDefinition } from './form-definition'

/**
 * UpdateValuesExample
 *
 * This example demonstrates using setValue() to update form values programmatically
 * WITHOUT remounting the form. This is useful when you want to:
 * - Preserve form state (touched, dirty, errors, etc.)
 * - Update specific fields without resetting the entire form
 * - Make granular updates based on user interaction
 *
 * This is a CONTROLLED pattern where you programmatically update the form values
 * while keeping the same form instance.
 *
 * Compare this to the other examples (Runtime, Debug, Dynamic, Tuple) which use
 * the UNCONTROLLED pattern with key prop to remount the form with new defaultValues.
 */
function UpdateValuesExample() {
  const [formState, setFormState] = useState<{ isValid?: boolean; isSubmitted?: boolean }>({})
  const [logs, setLogs] = useState<{ label: string; log: string }[]>([])
  const formMethodsRef = useRef<UseFormReturn<any, any, undefined> | null>(null)

  // Static defaultValues - set once on initial render (uncontrolled pattern)
  const defaultValues = useMemo(() => collectDefaultValues(formDefinition), [])

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
      {/* Column 1: Form */}
      <div className="border-border bg-background p-cn-md rounded-cn-6 border" style={{ width: '500px' }}>
        <Layout.Vertical gap="md">
          <Text>Update Values with setValue()</Text>
          <Card.Root>
            <Card.Content>
              <Text className="text-muted-foreground">
                This example uses <code className="bg-muted px-1">setValue()</code> to update form values without
                remounting. Form state (touched, dirty, errors) is preserved.
              </Text>
            </Card.Content>
          </Card.Root>

          <RootForm
            defaultValues={defaultValues}
            onSubmit={onSubmit}
            resolver={resolver}
            mode={'onSubmit'}
            onValuesChange={onValuesChange}
            onValidationChange={onValidationChange}
          >
            {rootForm => {
              // Store form methods in ref for external access
              formMethodsRef.current = rootForm

              return (
                <Layout.Vertical gap="lg">
                  <RenderForm factory={inputComponentFactory} inputs={formDefinition} className="space-y-cn-md" />

                  <Layout.Horizontal gap="md" className="mt-2">
                    <Button onClick={() => rootForm.submitForm()} className="self-start">
                      Submit
                    </Button>
                    <Button
                      onClick={() => {
                        rootForm.reset(defaultValues)
                        addLog('FORM RESET', 'Form reset to default values')
                      }}
                      variant="secondary"
                      className="self-start"
                    >
                      Reset Form
                    </Button>
                  </Layout.Horizontal>
                </Layout.Vertical>
              )
            }}
          </RootForm>
        </Layout.Vertical>
      </div>

      {/* Column 2: Form Status */}
      <div className="w-48">
        <FormStatus formState={formState} />
        <Card.Root className="mt-4">
          <Card.Title>Form State Info</Card.Title>
          <Card.Content>
            <div className="space-y-1 text-sm">
              <div>
                <strong>isDirty:</strong> {formMethodsRef.current?.formState.isDirty ? 'true' : 'false'}
              </div>
              <div>
                <strong>dirtyFields:</strong> {JSON.stringify(formMethodsRef.current?.formState.dirtyFields || {})}
              </div>
              <div>
                <strong>touchedFields:</strong> {JSON.stringify(formMethodsRef.current?.formState.touchedFields || {})}
              </div>
            </div>
          </Card.Content>
        </Card.Root>
      </div>

      {/* Column 3: Update Actions */}
      <Layout.Vertical gap="sm" className="w-96">
        <Text className="text-foreground-1 mb-cn-xs text-sm font-semibold">
          Update using setValue() (preserves form state)
        </Text>

        <Button
          onClick={async () => {
            if (formMethodsRef.current) {
              formMethodsRef.current.setValue('name', 'John Doe')
              formMethodsRef.current.setValue('email', 'john@example.com')
              formMethodsRef.current.setValue('age', 25)
              // Trigger validation after setting all values
              await formMethodsRef.current.trigger()
              addLog('UPDATE', 'Updated name, email, and age using setValue() + trigger()')
            }
          }}
          variant="secondary"
          className="self-start"
        >
          Set Valid Values
        </Button>

        <Button
          onClick={async () => {
            if (formMethodsRef.current) {
              formMethodsRef.current.setValue('name', 'AB') // Too short - invalid
              formMethodsRef.current.setValue('email', 'invalid-email') // Invalid format
              formMethodsRef.current.setValue('age', 15) // Too young - invalid
              // Trigger validation after setting all values to show all errors
              await formMethodsRef.current.trigger()
              addLog('UPDATE', 'Updated with invalid values using setValue() + trigger()')
            }
          }}
          variant="secondary"
          className="self-start"
        >
          Set Invalid Values
        </Button>

        <Button
          onClick={() => {
            if (formMethodsRef.current) {
              formMethodsRef.current.setValue('name', 'Jane Smith')
              addLog('UPDATE', 'Updated only name field using setValue()')
            }
          }}
          variant="secondary"
          className="self-start"
        >
          Update Single Field (name)
        </Button>

        <Button
          onClick={() => {
            if (formMethodsRef.current) {
              formMethodsRef.current.setValue('bio', 'Software engineer passionate about React and forms')
              formMethodsRef.current.setValue('active', true)
              addLog('UPDATE', 'Updated bio and active using setValue()')
            }
          }}
          variant="secondary"
          className="self-start"
        >
          Update Optional Fields
        </Button>

        <Button
          onClick={() => {
            if (formMethodsRef.current) {
              // Alternative approach: use shouldValidate option on each setValue
              formMethodsRef.current.setValue('name', 'XY', { shouldValidate: true })
              formMethodsRef.current.setValue('email', 'bad-email', { shouldValidate: true })
              formMethodsRef.current.setValue('age', 10, { shouldValidate: true })
              addLog('UPDATE', 'Updated with invalid values using setValue({ shouldValidate: true })')
            }
          }}
          variant="secondary"
          className="self-start"
        >
          Set Invalid Values (with shouldValidate)
        </Button>

        <Card.Root className="mt-4">
          <Card.Title>Setting Multiple Values</Card.Title>
          <Card.Content>
            <Text className="text-muted-foreground text-sm">
              <strong>Approach 1: setValue() + trigger()</strong>
              <br />
              Set all values first, then call trigger() to validate all fields at once.
              <br />
              <code className="bg-muted px-1 text-xs">
                setValue('field1', val1)
                <br />
                setValue('field2', val2)
                <br />
                await trigger()
              </code>
              <br />
              <br />
              <strong>Approach 2: setValue with shouldValidate</strong>
              <br />
              Validate each field immediately as it's set.
              <br />
              <code className="bg-muted px-1 text-xs">
                setValue('field', val, {'{'} shouldValidate: true {'}'})
              </code>
              <br />
              <br />
              <strong>key prop approach (other examples):</strong>
              <br />
              ✓ Complete form reset
              <br />
              ✓ Fresh form instance
              <br />✓ Simpler for "start over" scenarios
            </Text>
          </Card.Content>
        </Card.Root>
      </Layout.Vertical>

      {/* Column 4: Event Logs */}
      <div className="min-w-0 flex-1">
        <FormEvents logs={logs} onClearLogs={() => setLogs([])} />
      </div>
    </Layout.Horizontal>
  )
}

export default UpdateValuesExample
