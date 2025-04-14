import { useEffect, useMemo, useState } from 'react'

import { Problem, ProblemSeverity } from '@components/problems'
import { Resizable } from '@components/resizable'
import {
  countProblems,
  monacoMarkers2Problems
} from '@views/unified-pipeline-studio/components/graph-implementation/utils/problems-utils'
import { UnifiedPipelineStudioProblemsPanel } from '@views/unified-pipeline-studio/components/panel/unified-pipeline-studio-problems-panel'
import { editor } from 'monaco-editor'

import { useYamlEditorContext, YamlEditor, YamlRevision } from '@harnessio/yaml-editor'

import { monacoThemes } from '..'

export interface YamlViewProps {
  yamlSchema: Record<string, any>
  yamlRevision: YamlRevision
  onYamlRevisionChange: (yamlRevision: YamlRevision) => void
  theme: 'light' | 'dark'
  onYamlEditorErrorsChange: (problems: {
    problems: Problem<editor.IMarker>[]
    problemsCount: Record<ProblemSeverity | 'all', number>
    isYamlValid: boolean
  }) => void
}

export default function YamlView(props: YamlViewProps) {
  const { yamlRevision, onYamlRevisionChange, theme, yamlSchema, onYamlEditorErrorsChange } = props

  const { markers } = useYamlEditorContext()

  const [problems, setProblems] = useState<{
    problems: Problem<editor.IMarker>[]
    problemsCount: Record<ProblemSeverity | 'all', number>
    isYamlValid: boolean
  }>({ problems: [], isYamlValid: true, problemsCount: { all: 0, error: 0, info: 0, warning: 0 } })

  useEffect(() => {
    const problems = monacoMarkers2Problems(markers)
    const problemsCount = countProblems(problems)
    const isYamlValid = problemsCount.error === 0

    const errors = { problems, problemsCount, isYamlValid }

    setProblems(errors)

    onYamlEditorErrorsChange(errors)
  }, [markers])

  const schemaConfig = useMemo(() => {
    return {
      schema: yamlSchema,
      // TODO: temporary
      uri: 'https://raw.githubusercontent.com/bradrydzewski/spec/master/dist/inputs.json'
    }
  }, [yamlSchema])

  const yamlEditor = useMemo(() => {
    return (
      <YamlEditor
        schemaConfig={schemaConfig}
        instanceId="run-pipeline-form"
        inlineActions={[]}
        theme={theme}
        themeConfig={{
          defaultTheme: 'dark',
          themes: monacoThemes
        }}
        yamlRevision={yamlRevision}
        onYamlRevisionChange={revision => {
          onYamlRevisionChange(revision!)
        }}
      />
    )
  }, [schemaConfig, theme, monacoThemes, yamlRevision])

  return (
    <div className="flex grow flex-col">
      <Resizable.PanelGroup direction="vertical" className="border-5 grow">
        <Resizable.Panel order={1} className="flex">
          {yamlEditor}
        </Resizable.Panel>

        {problems.problemsCount.all > 0 && (
          <>
            <Resizable.Handle />
            <Resizable.Panel defaultSize={20} id="panel" minSize={10} maxSize={90} order={2} className="h-full py-2">
              <UnifiedPipelineStudioProblemsPanel problems={problems.problems} />
            </Resizable.Panel>
          </>
        )}
      </Resizable.PanelGroup>
    </div>
  )
}
