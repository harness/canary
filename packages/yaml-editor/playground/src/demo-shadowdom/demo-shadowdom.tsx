import { useMemo, useState } from 'react'

import styleCss from 'monaco-editor/min/vs/editor/editor.main.css?inline'

import { ThemeDefinition, YamlEditor } from '../../../src'
import { YamlRevision } from '../../../src/components/YamlEditor'
import { stageApproval } from '../common/content/pipeline-stage-approval'
import { getInlineActionExample } from '../common/inline-actions/inline-actions-def'
import unifiedSchema from '../common/schema/unified.json'
import { harnessDarkTheme, harnessLightTheme } from '../common/theme/theme'
import ShadowDomWrapper from './shadow-dom-wrapper'

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

export const DemoShadowDom: React.FC<React.PropsWithChildren<React.HTMLAttributes<HTMLElement>>> = () => {
  const [yamlRevision, setYamlRevision] = useState<YamlRevision>({ yaml: stageApproval })
  const [showYamlEditor, setShowYamlEditor] = useState(true)
  const [_selectedPath, setSelectedPath] = useState<string | undefined>()

  const inlineActionExample = useMemo(() => getInlineActionExample({ setSelectedPath }), [setSelectedPath])

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
        <ShadowDomWrapper>
          {showYamlEditor && (
            <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
              <style>{styleCss}</style>

              <YamlEditor
                onYamlRevisionChange={value => {
                  setYamlRevision(value ?? { yaml: '', revisionId: 0 })
                  setSelectedPath(undefined)
                }}
                yamlRevision={yamlRevision}
                schemaConfig={schemaConfig}
                inlineActions={inlineActionExample}
                themeConfig={themeConfig}
              />
            </div>
          )}
        </ShadowDomWrapper>
      </div>
    </div>
  )
}
