import { useMemo, useState } from 'react'

import { stringify } from 'yaml'

import { IFormDefinition, InputFactory } from '@harnessio/forms'
import { YamlRevision } from '@harnessio/yaml-editor'

import { VisualYamlValue } from '..'
import { collectDefaultValues } from './utils/form-utils'
import { pipelineInputs2FormInputs } from './utils/inputs-utils'
import { parseYamlSafe } from './utils/yaml-utils'
import VisualView from './visual-view'
import YamlView from './yaml-view'

export interface RunPipelineFormInputsProps {
  view: VisualYamlValue
  pipelineInputs: Record<string, unknown>
  yamlRevision: YamlRevision
  onYamlRevisionChange: (yamlRevision: YamlRevision) => void
  onYamlSyntaxValidChange: (valid: boolean) => void
  inputComponentFactory: InputFactory
  theme: 'light' | 'dark'
}

export default function RunPipelineFormInputs(props: RunPipelineFormInputsProps) {
  const {
    pipelineInputs,
    view,
    yamlRevision,
    onYamlRevisionChange,
    onYamlSyntaxValidChange,
    inputComponentFactory,
    theme
  } = props

  const formDefinition: IFormDefinition = useMemo(() => {
    return { inputs: pipelineInputs2FormInputs(pipelineInputs, { prefix: 'inputs.' }) }
  }, [pipelineInputs])

  const [formValues, setFormValues] = useState<Record<string, unknown> | undefined>(
    collectDefaultValues(formDefinition)
  )

  const handleFormValuesChange = (values: any) => {
    onYamlRevisionChange({ yaml: stringify(values) })
    setFormValues(values)
  }

  const handleYamlRevisionChange = (revision: YamlRevision) => {
    const output = parseYamlSafe(revision.yaml)
    if (output.isYamlSyntaxValid) {
      setFormValues(output.yamlObject)
    }
    onYamlSyntaxValidChange(output.isYamlSyntaxValid)
    onYamlRevisionChange(revision)
  }

  return (
    <>
      {view === 'yaml' ? (
        <YamlView onYamlRevisionChange={handleYamlRevisionChange} yamlRevision={yamlRevision} theme={theme} />
      ) : (
        <VisualView
          formValues={formValues}
          onFormValuesChange={handleFormValuesChange}
          formDefinition={formDefinition}
          inputComponentFactory={inputComponentFactory}
        />
      )}
    </>
  )
}
