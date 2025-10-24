import { useMemo, useState } from 'react'

import { ThemeDefinition, YamlEditor } from '../../../src'
import { YamlRevision } from '../../../src/components/YamlEditor'
import { stageApproval } from '../common/content/pipeline-stage-approval'
import { getInlineActionExample } from '../common/inline-actions/inline-actions-def'
import unifiedSchema from '../common/schema/unified.json'
import { harnessDarkTheme, harnessLightTheme } from '../common/theme/theme'

const themes: ThemeDefinition[] = [
  { themeName: 'dark', themeData: harnessDarkTheme },
  { themeName: 'light', themeData: harnessLightTheme }
]

const schemaConfig = {
  schema: unifiedSchema,
  uri: 'https://raw.githubusercontent.com/bradrydzewski/spec/master/dist/schema.json'
}

const themeConfig = {
  defaultTheme: 'dark',
  themes
}

export const Demo1: React.FC<React.PropsWithChildren<React.HTMLAttributes<HTMLElement>>> = () => {
  const [yamlRevision, setYamlRevision] = useState<YamlRevision>({ yaml: stageApproval })
  const [showYamlEditor, setShowYamlEditor] = useState(true)
  const [selectedPath, setSelectedPath] = useState<string | undefined>()

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
    <div className="demo-holder">
      <div className="buttons-holder">
        <button
          onClick={() => {
            setYamlRevision({ yaml: stageApproval })
          }}
        >
          Reset YAML content
        </button>
        <button
          onClick={() => {
            setShowYamlEditor(!showYamlEditor)
          }}
        >
          Toggle mount yaml editor
        </button>
      </div>
      <div className="editor-holder">
        {showYamlEditor && (
          <YamlEditor
            onYamlRevisionChange={value => {
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
    </div>
  )
}
