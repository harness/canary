import { useState } from 'react'

import { InputFactory } from '@harnessio/forms'
import {
  AccordionFormInput,
  BooleanFormInput,
  CalendarInput,
  GroupFormInput,
  NumberFormInput,
  RunPipelineDrawerContent as RunPipelineDrawerContentView,
  SelectFormInput,
  TextFormInput,
  VisualYamlValue,
  type InputLayout
} from '@harnessio/ui/views'
import { YamlRevision } from '@harnessio/yaml-editor'

const inputComponentFactory = new InputFactory()
inputComponentFactory.registerComponent(new TextFormInput())
inputComponentFactory.registerComponent(new BooleanFormInput())
inputComponentFactory.registerComponent(new NumberFormInput())
inputComponentFactory.registerComponent(new GroupFormInput())
inputComponentFactory.registerComponent(new SelectFormInput())
inputComponentFactory.registerComponent(new CalendarInput())
inputComponentFactory.registerComponent(new AccordionFormInput())

const pipelineInputs = {
  stringRequired: { type: 'string', required: true },

  A1: { type: 'string' },
  A2: { type: 'string' },
  A3: { type: 'string' },
  B1: { type: 'string' },
  B2Sub1: { type: 'string' },
  B2Sub2: { type: 'string' },
  B3: { type: 'string' },
  C1: { type: 'string' },
  C2: { type: 'string' },
  C3: { type: 'string' },

  stringPattern: { type: 'string', pattern: '^[A-Z]*$' },
  stringRequiredPattern: { type: 'string', required: true, pattern: '^[A-Z]*$' },
  stringEnum: { type: 'string', enum: ['Option 1', 'Option 2', 'Option 3'] },
  stringEnumDefault: { type: 'string', enum: ['Option 1', 'Option 2', 'Option 3'], default: 'Option 2' },
  stringDefault: { type: 'string', default: 'Default value 1' },
  stringRequiredDefault: { type: 'string', required: true, default: 'Default value 2' },
  boolean: { type: 'boolean' },
  booleanDefaultTrue: { type: 'boolean', default: true },
  booleanDefaultFalse: { type: 'boolean', default: false },
  nonComponentFactory: {
    type: 'string',
    required: true,
    ui: {
      component: 'non-component-factory'
    }
  },
  stringCalendarUIcel: {
    type: 'string',
    required: true,
    ui: {
      component: 'calendar',
      placeholder: 'select a date',
      tooltip: 'todays date will be selected by default',
      visible: "${{stringSelectWithDefaultUI=='kubernetes'}}"
    }
  },
  booleanUIcel: {
    type: 'boolean',
    required: true,
    ui: {
      component: 'boolean',
      visible: "${{stringSelectWithDefaultUI=='helm'}}"
    }
  },
  stringSelectWithDefaultUI: {
    type: 'string',
    required: true,
    options: ['docker', 'kubernetes', 'helm'],
    default: 'docker',
    ui: {
      component: 'select',
      placeholder: 'select a connector type',
      tooltip: 'docker connector will be selected by default'
    }
  }
}

const layout: InputLayout = [
  'stringSelectWithDefaultUI',
  'stringCalendarUIcel',
  'booleanUIcel',
  'nonComponentFactory',
  'stringRequired',
  {
    title: 'A',

    items: ['A1', 'A2']
  },
  {
    title: 'B',
    items: ['B1', { title: 'B2', items: ['B2Sub1', 'B2Sub2'] }, 'B3']
  },
  {
    title: 'C',
    items: ['C1', 'C2', 'C3']
  },
  'stringRequired',
  {
    items: ['stringPattern', 'stringRequiredPattern']
  },
  {
    title: 'Advanced',
    open: true,
    items: [
      'stringEnum',
      'stringEnumDefault',
      {
        title: 'Subgroup',
        items: [
          'stringRequiredDefault',
          {
            title: 'Nested Subgroup',
            items: ['boolean', 'booleanDefaultTrue', 'booleanDefaultFalse']
          }
        ]
      }
    ]
  }
  /* excluding "stringDefault" deliberately */
]

export interface RunPipelineFormProps {
  onClose: () => void
}

export default function RunPipelineDrawerContent({ onClose }: RunPipelineFormProps) {
  const [yamlRevision, setYamlRevision] = useState<YamlRevision>({ yaml: '' })
  const [view, setView] = useState<VisualYamlValue>('visual')
  const [isLoadingPipeline] = useState(false)
  const [isValid, setIsValid] = useState(true)
  const [error, setError] = useState<{ message?: string } | undefined>()

  return (
    <RunPipelineDrawerContentView
      isValid={isValid}
      onValidationChange={setIsValid}
      view={view}
      onViewChange={setView}
      isLoadingPipeline={isLoadingPipeline}
      yamlRevision={yamlRevision}
      onYamlRevisionChange={setYamlRevision}
      onCancel={onClose}
      onRun={() => setError({ message: 'Pipeline execution failed. Error message ...' })}
      pipelineInputs={pipelineInputs}
      pipelineInputLayout={layout}
      inputComponentFactory={inputComponentFactory}
      theme={'dark'}
      error={error}
      isExecutingPipeline={false}
    />
  )
}
