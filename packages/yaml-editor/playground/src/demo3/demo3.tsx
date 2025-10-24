import { useState } from 'react'

import { CodeEditor, ThemeDefinition } from '../../../src'
import { CodeRevision } from '../../../src/components/CodeEditor'
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

export const Demo3: React.FC<React.PropsWithChildren<React.HTMLAttributes<HTMLElement>>> = () => {
  const [codeRevision, setCodeRevision] = useState<CodeRevision>({ code: reactFileContent })
  const [showEditor, setShowEditor] = useState(true)

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
        {showEditor && (
          <CodeEditor
            onCodeRevisionChange={value => {
              setCodeRevision(value ?? { code: '', revisionId: 0 })
            }}
            codeRevision={codeRevision}
            themeConfig={themeConfig}
            language={'typescript'}
          />
        )}
      </div>
    </div>
  )
}
