import { YamlEditor, YamlRevision } from '@harnessio/yaml-editor'

export interface YamlViewProps {
  yamlRevision: YamlRevision
  onYamlRevisionChange: (yamlRevision: YamlRevision) => void
  theme: 'light' | 'dark'
}

export default function YamlView(props: YamlViewProps) {
  const { yamlRevision, onYamlRevisionChange, theme } = props

  return (
    <div style={{ height: '300px' }}>
      <YamlEditor
        inlineActions={[]}
        theme={theme}
        yamlRevision={yamlRevision}
        onYamlRevisionChange={revision => {
          onYamlRevisionChange(revision!)
        }}
      />
    </div>
  )
}
