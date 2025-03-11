import { Icon, ToggleGroup } from '@/components'

export type VisualYamlValue = 'visual' | 'yaml'

interface VisualYamlToggleProps {
  view: VisualYamlValue
  setView: (view: VisualYamlValue) => void
  isYamlValid: boolean
}

export const VisualYamlToggle = (props: VisualYamlToggleProps): JSX.Element => {
  const { view, setView, isYamlValid } = props
  return (
    <ToggleGroup.Root
      className="h-8 rounded-md border border-borders-1 bg-background-3 px-1"
      onValueChange={value => {
        if (value) {
          setView(value as VisualYamlValue)
        }
      }}
      value={view}
      type="single"
      unselectable="on"
    >
      <ToggleGroup.Item
        disabled={!isYamlValid}
        value="visual"
        className="rounded text-13 disabled:opacity-100"
        size="xs"
      >
        {!isYamlValid && <Icon name="fail" className="mr-1 text-destructive" />}
        Visual
      </ToggleGroup.Item>
      <ToggleGroup.Item value="yaml" className="rounded text-13" size="xs">
        YAML
      </ToggleGroup.Item>
    </ToggleGroup.Root>
  )
}
