import React, { useMemo, useState } from 'react'
import { ThemeDefinition, YamlEditor } from '@harnessio/yaml-editor'
import { useDataContext } from './DataProvider'
import unifiedSchema from '../../configurations/schema/unified.json'
import { harnessDarkTheme, harnessLightTheme } from '../../configurations/theme/theme'
import { stageApproval } from '../../configurations/pipeline/stage-approval'
import { getInlineActionExample } from '../../configurations/inline-actions/inline-actions-def'

const themes: ThemeDefinition[] = [
  { themeName: 'dark', themeData: harnessDarkTheme },
  { themeName: 'light', themeData: harnessLightTheme }
]

const schemaConfig = {
  schema: unifiedSchema,
  uri: 'https://raw.githubusercontent.com/bradrydzewski/spec/master/dist/schema.json'
}

const themeConfig = {
  //rootElementSelector: '#root',
  defaultTheme: 'dark',
  themes
}

export const YamlEditorWrapper: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { yamlRevision, setYamlRevision } = useDataContext()
  const [showYamlEditor, setShowYamlEditor] = useState(true)
  const [selectedPath, setSelectedPath] = useState<string | undefined>('pipeline.stages.0.steps.0')

  const inlineActionExample = useMemo(() => getInlineActionExample({ setSelectedPath }), [setSelectedPath])

  const selection = useMemo(
    () =>
      selectedPath
        ? {
            path: selectedPath,
            className: 'highlightYaml',
            revealInCenter: true
          }
        : undefined,
    [selectedPath]
  )

  return (
    <>
      <div>
        <button
          onClick={() => {
            setYamlRevision({ yaml: stageApproval })
          }}>
          Update yaml
        </button>
        <button
          onClick={() => {
            setShowYamlEditor(!showYamlEditor)
          }}>
          Toggle mount
        </button>
      </div>
      <div style={{ display: 'flex', height: '500px' }}>
        {showYamlEditor && (
          <YamlEditor
            onYamlRevisionChange={(value, data) => {
              setYamlRevision(value ?? { yaml: '', revisionId: 0 })
              setSelectedPath(undefined)
            }}
            yamlRevision={yamlRevision}
            schemaConfig={schemaConfig}
            inlineActions={inlineActionExample}
            themeConfig={themeConfig}
            selection={selection}
          />
        )}
      </div>
    </>
  )
}
