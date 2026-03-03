import { useCallback, useRef, useState } from 'react'

import { cloneDeep, isEqual, set } from 'lodash-es'

import { AnyFormValue, collectDefaultValues, RenderForm, RootForm, useZodValidationResolver } from '@harnessio/forms'
import { Button, Card, Layout, Text } from '@harnessio/ui/components'

import inputComponentFactory from '../../implementation/factory/factory'
import { formDefinition } from './form-definition'

/**
 * InputSetExample
 *
 * This example demonstrates a common infinite loop scenario that can occur
 * when form values are transformed (e.g., converting to JSON and back).
 *
 * The issue: When metadata fields (identifier, name) are stripped during
 * transformation but exist in defaultValues, they ping-pong between
 * present and absent, causing infinite re-renders.
 *
 * Root cause: Using getValues() creates new object references on every render,
 * triggering useEffects repeatedly.
 *
 * Solution: Use watch() subscription pattern or ensure referential equality.
 */
function InputSetExample() {
  const [jsonOutput, setJsonOutput] = useState<string>('')
  const [parsedJsonValues, setParsedJsonValues] = useState<Record<string, unknown>>({})
  const [currentFormValues, setCurrentFormValues] = useState<Record<string, unknown>>({})
  const renderCountRef = useRef(0)
  const previousValuesRef = useRef<AnyFormValue>()

  const [defaultValues, setDefaultValues] = useState(() => ({
    ...collectDefaultValues(formDefinition),
    identifier: 'input_set_id',
    name: 'Input Set Name'
  }))

  const resolver = useZodValidationResolver(formDefinition, {
    validationConfig: {
      requiredMessage: 'Required input'
    }
  })

  // useEffect(() => {
  //   renderCountRef.current++
  // })

  const handleFormValuesChange = useCallback((values: AnyFormValue) => {
    // Clone values to avoid proxy comparison issues
    const clonedValues = cloneDeep(values)

    // Prevent infinite loop by checking if values actually changed
    if (isEqual(previousValuesRef.current, clonedValues)) {
      return
    }

    previousValuesRef.current = clonedValues

    // Update current form values for display
    setCurrentFormValues(clonedValues)

    // Simulate input set behavior: only preserve inputs and stages
    // This strips metadata (identifier, name) causing ping-pong effect
    const payloadValues: Record<string, unknown> = {}
    set(payloadValues, 'inputs', values?.inputs)
    set(payloadValues, 'stages', values?.stages)

    const jsonString = JSON.stringify(payloadValues, null, 2)
    setJsonOutput(jsonString)

    // Parse back and show what would be returned - this removes identifier/name
    try {
      const parsed = JSON.parse(jsonString)
      if (parsed) {
        setParsedJsonValues(parsed as Record<string, unknown>)
      }
    } catch (ex) {
      console.error('Failed to parse JSON:', ex)
    }
  }, [])

  const onSubmit = (values: AnyFormValue) => {
    console.log('Submitted values:', values)
  }

  return (
    <Layout.Horizontal gap="xl" align="start">
      {/* Column 1: Form */}
      <div className="border-border bg-background p-cn-md rounded-cn-6 border" style={{ width: '500px' }}>
        <Layout.Vertical gap="md">
          <Text>Input Set Form</Text>
          <Card.Root>
            <Card.Content>
              <Text className="text-destructive">Render count: {renderCountRef.current}</Text>
              <Text className="text-muted-foreground mt-2">
                Watch for increasing render count indicating infinite loop
              </Text>
            </Card.Content>
          </Card.Root>

          <RootForm
            defaultValues={defaultValues}
            onSubmit={onSubmit}
            resolver={resolver}
            mode={'onSubmit'}
            onValuesChange={handleFormValuesChange}
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
        </Layout.Vertical>
      </div>

      {/* Column 2: JSON Output */}
      <div className="border-border bg-background p-cn-md rounded-cn-6 border flex-1">
        <Layout.Vertical gap="md">
          <Text>JSON Output (Metadata Stripped)</Text>
          <Card.Root>
            <Card.Content>
              <pre className="text-xs overflow-auto max-h-96">
                <code>{jsonOutput || 'No output yet'}</code>
              </pre>
            </Card.Content>
          </Card.Root>

          <Text className="mt-4">Current Form Values</Text>
          <Card.Root>
            <Card.Content>
              <pre className="text-xs overflow-auto max-h-96">
                <code>{JSON.stringify(currentFormValues, null, 2)}</code>
              </pre>
            </Card.Content>
          </Card.Root>

          <Text className="mt-4">Parsed JSON Values (After Transformation)</Text>
          <Card.Root>
            <Card.Content>
              <pre className="text-xs overflow-auto max-h-96">
                <code>{JSON.stringify(parsedJsonValues, null, 2)}</code>
              </pre>
            </Card.Content>
          </Card.Root>
        </Layout.Vertical>
      </div>
    </Layout.Horizontal>
  )
}

export default InputSetExample
