import { YamlEditor, YamlRevision } from '@harnessio/yaml-editor'

import { monacoThemes } from '..'

export interface YamlViewProps {
  yamlRevision: YamlRevision
  onYamlRevisionChange: (yamlRevision: YamlRevision) => void
  theme: 'light' | 'dark'
}

export default function YamlView(props: YamlViewProps) {
  const { yamlRevision, onYamlRevisionChange, theme } = props

  console.log(theme)
  return (
    <div style={{ height: '300px' }}>
      <YamlEditor
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
    </div>
  )
}
