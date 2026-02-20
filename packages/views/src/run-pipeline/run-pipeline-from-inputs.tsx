import { useEffect, useMemo, useState } from 'react'

import { noop } from 'lodash-es'
import { stringify } from 'yaml'

import { AnyFormValue, IFormDefinition, InputFactory, RootFormProps } from '@harnessio/forms'
import { YamlEditorContextProvider, YamlRevision } from '@harnessio/yaml-editor'

import { VisualYamlValue } from '..'
import { PipelineInputDefinition } from './types'
import { collectDefaultValues } from './utils/form-utils'
import { pipelineInputs2FormInputs, pipelineInputs2JsonSchema } from './utils/inputs-utils'
import { type InputLayout } from './utils/types'
import { parseYamlSafe } from './utils/yaml-utils'
import VisualView from './visual-view'
import YamlView from './yaml-view'

export interface RunPipelineFormInputsProps {
  view: VisualYamlValue
  pipelineInputs: Record<string, PipelineInputDefinition>
  yamlRevision: YamlRevision
  onYamlRevisionChange: (yamlRevision: YamlRevision) => void
  onValidationChange: (formState: { isValid: boolean; isSubmitted?: boolean }) => void
  onYamlSyntaxValidationChange: (valid: boolean) => void
  inputComponentFactory: InputFactory
  theme: 'light' | 'dark'
  rootFormRef: React.MutableRefObject<
    | {
        submitForm: () => void
      }
    | undefined
  >
  onFormSubmit: (values: AnyFormValue) => void
  pipelineInputLayout?: InputLayout
}

export default function RunPipelineFormInputs(props: RunPipelineFormInputsProps) {
  const {
    pipelineInputs,
    view,
    yamlRevision,
    onYamlRevisionChange,
    /** Validation common to both yaml and form */
    onValidationChange,
    /**
     * Validation specific to yaml syntax.
     * Use case: When yaml syntax is broken, user cannot navigate to visual view.
     */
    onYamlSyntaxValidationChange,
    inputComponentFactory,
    theme,
    rootFormRef,
    onFormSubmit,
    pipelineInputLayout
  } = props

  const formDefinition: IFormDefinition = useMemo(() => {
    return {
      inputs: pipelineInputs2FormInputs({
        pipelineInputs,
        options: { prefix: 'inputs.' },
        pipelineInputLayout,
        inputComponentFactory
      })
    }
  }, [pipelineInputs, inputComponentFactory])

  const [formValues, setFormValues] = useState<Record<string, unknown> | undefined>()

  useEffect(() => {
    // NOTE: form may contain default values. Call onYamlRevisionChange to update parent.
    const initialValues = collectDefaultValues(formDefinition)
    setFormValues(initialValues)
    onYamlRevisionChange({ yaml: stringify(initialValues) })
  }, [pipelineInputs])

  const yamlSchema = useMemo(() => {
    return pipelineInputs2JsonSchema(pipelineInputs)
  }, [pipelineInputs])

  const handleFormValuesChange = (values: AnyFormValue) => {
    onYamlRevisionChange({ yaml: stringify(values) })
    setFormValues(values)
  }

  const handleFormValidationChange: RootFormProps['onValidationChange'] = formState => {
    onValidationChange(formState)
  }

  const handleYamlRevisionChange = (revision: YamlRevision) => {
    const output = parseYamlSafe(revision.yaml)
    if (output.isYamlSyntaxValid) {
      setFormValues(output.yamlObject)
    }
    onYamlSyntaxValidationChange(output.isYamlSyntaxValid)

    // TODO: schema validation missing
    onValidationChange({ isValid: output.isYamlSyntaxValid, isSubmitted: true })

    onYamlRevisionChange(revision)
  }

  return view === 'yaml' ? (
    <YamlEditorContextProvider>
      <YamlView
        yamlSchema={yamlSchema}
        onYamlRevisionChange={handleYamlRevisionChange}
        yamlRevision={yamlRevision}
        theme={theme}
        onYamlEditorErrorsChange={noop}
      />
    </YamlEditorContextProvider>
  ) : (
    <VisualView
      formValues={formValues}
      onFormValuesChange={handleFormValuesChange}
      onFormValidationChange={handleFormValidationChange}
      onFormSubmit={onFormSubmit}
      rootFormRef={rootFormRef}
      formDefinition={formDefinition}
      inputComponentFactory={inputComponentFactory}
    />
  )
}
