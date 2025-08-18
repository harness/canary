import { useMemo, useState } from 'react'

import styleCss from 'monaco-editor/min/vs/editor/editor.main.css?inline'

import { CodeEditor, ThemeDefinition } from '../../../src'
import { CodeRevision } from '../../../src/components/CodeEditor'
import codeEditorCss from '../../../src/components/CodeEditor.css?inline'
import ShadowDomWrapper from '../common/components/shadow-dom-wrapper'
import { reactFileContent } from '../common/content/react'
import { harnessDarkTheme, harnessLightTheme } from '../common/theme/theme'

const themes: ThemeDefinition[] = [
  { themeName: 'dark', themeData: harnessDarkTheme },
  { themeName: 'light', themeData: harnessLightTheme }
]

const themeConfig = {
  defaultTheme: 'dark',
  themes
}

export const DemoCodeEditorShadowDom: React.FC<React.PropsWithChildren<React.HTMLAttributes<HTMLElement>>> = () => {
  const [codeRevision, setCodeRevision] = useState<CodeRevision>({ code: reactFileContent })
  const [showEditor, setShowEditor] = useState(true)

  const [fragment, setFragment] = useState('')

  const [bounds, setBounds] = useState<DOMRect>()

  const selectedLine = useMemo(() => {
    if (fragment.startsWith('L')) {
      const lineStr = fragment.replace('L', '')
      const line = parseInt(lineStr)
      return isNaN(line) ? undefined : line
    }
  }, [fragment])

  return (
    <div className="demo-holder">
      <div className="buttons-holder">
        <button
          onClick={() => {
            setCodeRevision({ code: reactFileContent })
          }}
        >
          Reset editor content
        </button>
        <button
          onClick={() => {
            setShowEditor(!showEditor)
          }}
        >
          Toggle mount editor
        </button>
      </div>
      <div className="editor-holder">
        <ShadowDomWrapper>
          {showEditor && (
            <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
              <style>{styleCss}</style>
              <style>{codeEditorCss}</style>
              <CodeEditor
                onCodeRevisionChange={value => {
                  setCodeRevision(value ?? { code: '', revisionId: 0 })
                }}
                codeRevision={codeRevision}
                themeConfig={themeConfig}
                language={'typescript'}
                options={{ readOnly: true }}
                enableLinesSelection={true}
                selectedLine={selectedLine}
                onSelectedLineChange={line => {
                  setFragment(line ? `L${line}` : '')
                }}
                onSelectedLineButtonClick={btnEL => {
                  if (btnEL) {
                    const bounds = btnEL.getBoundingClientRect()
                    setBounds(bounds)
                  } else {
                    setBounds(undefined)
                  }
                }}
                highlightKeyword="Services"
              />
            </div>
          )}
        </ShadowDomWrapper>
      </div>
      {bounds ? (
        <div
          style={{
            position: 'absolute',
            left: bounds?.left,
            top: bounds?.top + 30,
            background: 'lightgray',
            padding: '10px',
            border: '1px solid gray'
          }}
        >
          <div>Copy line</div>
          <div>Copy permalink</div>
        </div>
      ) : null}
    </div>
  )
}
