import { useMemo, useState } from 'react'

import {
  AnyFormValue,
  collectDefaultValues,
  RenderForm,
  RootForm,
  useZodValidationResolver,
  type IFormDefinition
} from '@harnessio/forms'
import { Button, Layout, Select } from '@harnessio/ui/components'

import { appendInputsPerformanceSchema } from '../../data/append-inputs-performance'
import appendInputsSchema from '../../data/append-inputs.json'
import { FormEvents } from '../../helpers/form-events'
import { FormStatus } from '../../helpers/form-status'
import { FormUpdate } from '../../helpers/form-update'
import inputComponentFactory from '../../implementation/factory/factory'
import { formDefinition } from './form-definition'
import {
  deleteSlotByPath,
  extractInputPaths,
  generateRandomId,
  getSlotPaths,
  insertInputsAtStructurePath,
  type InputInfo
} from './form-utils'
import { merge } from 'lodash-es'

function DynamicExample() {
  const [formState, setFormState] = useState<{ isValid?: boolean; isSubmitted?: boolean }>({})
  const [logs, setLogs] = useState<{ label: string; log: string }[]>([])
  // TODO: remove, use currentFormValues
  const [_defaultValues, setDefaultValues] = useState({})
  const [currentFormDefinition, setCurrentFormDefinition] = useState<IFormDefinition>(formDefinition)
  const [selectedInsertionPoint, setSelectedInsertionPoint] = useState<string>('0')
  const [currentFormValues, setCurrentFormValues] = useState({})

  // Get available input paths for the select dropdown
  const inputPaths: InputInfo[] = extractInputPaths(currentFormDefinition.inputs)

  // Get all slot paths for management
  const slotPaths = useMemo(() => getSlotPaths(currentFormDefinition), [currentFormDefinition])

  const onSubmit = (values: AnyFormValue) => {
    addLog('SUBMIT', values)
  }

  const onValuesChange = (values: AnyFormValue) => {
    setCurrentFormValues(values)
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

  const handleAppendSchema = (debug?: boolean) => {
    // Always create a new slot with random path
    const slotPath = `slot_${generateRandomId()}`
    const slotInput = {
      inputType: 'slot' as const,
      path: slotPath,
      label: `Dynamic Slot ${slotPath}`,
      inputConfig: { debug },
      inputs: appendInputsSchema.inputs // Add inputs directly to slot
    }

    console.log('Creating slot:', slotInput)

    // Insert slot at the selected insertion point
    const newInputs = insertInputsAtStructurePath(
      currentFormDefinition.inputs,
      selectedInsertionPoint,
      [slotInput] // Insert the slot as an array
    )

    const newFormDefinition: IFormDefinition = {
      ...currentFormDefinition,
      inputs: newInputs
    }

    console.log('Updated form definition:', newFormDefinition)

    setCurrentFormDefinition(newFormDefinition)

    // Update default values to include new inputs, preserving current form values
    const appendSchemaDefaults = collectDefaultValues(appendInputsSchema)
    const newDefaultValues = merge(currentFormValues, appendSchemaDefaults)
    setDefaultValues(newDefaultValues)

    addLog(
      'SLOT CREATED',
      `Created slot ${slotPath} with ${appendInputsSchema.inputs.length} inputs at position ${selectedInsertionPoint}`
    )
  }

  const handleDeleteSlot = (slotPath: string) => {
    const newFormDefinition = deleteSlotByPath(currentFormDefinition, slotPath)
    setCurrentFormDefinition(newFormDefinition)

    // Remove only the deleted slot's data, preserve all other form values
    const newFormValues = { ...currentFormValues } as any
    delete newFormValues[slotPath]

    // Update both current values and default values
    setCurrentFormValues(newFormValues)
    setDefaultValues(newFormValues)
  }

  const handleAppendPerformanceSchema = () => {
    // Always create a new slot with random path
    const slotPath = `slot_${generateRandomId()}`
    const slotInput = {
      inputType: 'slot' as const,
      path: slotPath,
      label: `Performance Slot ${slotPath}`,
      description: 'Container for performance test inputs',
      inputs: appendInputsPerformanceSchema.inputs // Add inputs directly to slot
    }

    // Insert slot at the selected insertion point
    const newInputs = insertInputsAtStructurePath(
      currentFormDefinition.inputs,
      selectedInsertionPoint,
      [slotInput] // Insert the slot as an array
    )

    const newFormDefinition: IFormDefinition = {
      ...currentFormDefinition,
      inputs: newInputs
    }

    setCurrentFormDefinition(newFormDefinition)

    // Update default values to include performance inputs, preserving current form values
    const performanceSchemaDefaults = collectDefaultValues(appendInputsPerformanceSchema)
    const newDefaultValues = {
      ...currentFormValues,
      [slotPath]: performanceSchemaDefaults
    }
    setDefaultValues(newDefaultValues)

    addLog(
      'PERFORMANCE SLOT CREATED',
      `Created performance slot ${slotPath} with ${appendInputsPerformanceSchema.inputs.length} inputs at position ${selectedInsertionPoint}`
    )
  }

  const handleShowInputPaths = () => {
    const inputPaths: InputInfo[] = extractInputPaths(currentFormDefinition.inputs)
    addLog('INPUT PATHS', JSON.stringify(inputPaths, null, 2))
  }

  const resolver = useZodValidationResolver(currentFormDefinition)

  return (
    <Layout.Horizontal gap="xl" align="start">
      {/* Column 1 */}
      <div className="border-border bg-background p-cn-md rounded-cn-6 border" style={{ width: '400px' }}>
        <RootForm
          defaultValues={currentFormValues}
          onSubmit={onSubmit}
          resolver={resolver}
          mode={'onSubmit'}
          onValuesChange={onValuesChange}
          onValidationChange={onValidationChange}
        >
          {rootForm => (
            <Layout.Vertical gap="lg">
              <RenderForm
                factory={inputComponentFactory}
                inputs={currentFormDefinition}
                className="space-y-cn-md"
                withoutWrapper={true}
              />
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

        {/* Slot Management */}
        {slotPaths.length > 0 && (
          <div className="mt-cn-lg">
            <div className="mb-2 text-sm font-medium">Slots</div>
            <div className="space-y-2">
              {slotPaths.map(slotPath => (
                <div key={slotPath} className="flex items-center justify-between">
                  <span className="truncate text-xs">{slotPath}</span>
                  <Button size="xs" variant="outline" onClick={() => handleDeleteSlot(slotPath)}>
                    Delete
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Column 3 */}
      <Layout.Vertical gap="sm" className="w-96">
        <FormUpdate onUpdate={setDefaultValues} values={currentFormValues} label="Reset values" />

        <div className="space-y-2">
          <div className="text-sm font-medium">Insert after:</div>
          <Select
            value={selectedInsertionPoint}
            onChange={setSelectedInsertionPoint}
            options={inputPaths.map(input => ({
              label: input.label,
              value: input.structurePath
            }))}
          />
        </div>

        <Button onClick={() => handleAppendSchema(false)} className="self-start">
          Append schema
        </Button>

        <Button onClick={() => handleAppendSchema(true)} className="self-start" variant="outline">
          Append schema (debug)
        </Button>

        <Button onClick={handleAppendPerformanceSchema} className="self-start" variant="outline">
          Append performance (200 inputs)
        </Button>

        <Button onClick={handleShowInputPaths} className="self-start" variant="secondary">
          Show input paths
        </Button>
      </Layout.Vertical>

      {/* Column 4 */}
      <div className="min-w-0 flex-1">
        <FormEvents logs={logs} onClearLogs={() => setLogs([])} />
      </div>
    </Layout.Horizontal>
  )
}

export default DynamicExample
