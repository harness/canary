import styleCss from 'monaco-editor/min/vs/editor/editor.main.css?inline'

import { BlameEditor, ThemeDefinition } from '../../../src'
import ShadowDomWrapper from '../common/components/shadow-dom-wrapper'
import { harnessDarkTheme, harnessLightTheme } from '../common/theme/theme'
import { blameData } from './blame-data'
import { fileContent } from './file-content'

const themes: ThemeDefinition[] = [
  { themeName: 'dark', themeData: harnessDarkTheme },
  { themeName: 'light', themeData: harnessLightTheme }
]

const themeConfig = {
  defaultTheme: 'dark',
  monacoThemes: themes
}

export const DemoShadowDomBlame: React.FC<React.PropsWithChildren<React.HTMLAttributes<HTMLElement>>> = () => {
  return (
    <div className="demo-holder">
      <div className="editor-holder" style={{ width: '1000px' }}>
        <ShadowDomWrapper>
          <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
            <style>{styleCss}</style>
            <BlameEditor
              lineNumbersPosition="center"
              code={fileContent}
              language={'json'}
              blameData={blameData}
              themeConfig={themeConfig}
              theme={'dark'}
            />
          </div>
        </ShadowDomWrapper>
      </div>
    </div>
  )
}
