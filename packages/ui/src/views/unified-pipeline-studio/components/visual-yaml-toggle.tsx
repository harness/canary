import { IconV2, ToggleGroup } from '@/components'

export type VisualYamlValue = 'visual' | 'yaml'

interface VisualYamlToggleProps {
  view: VisualYamlValue
  setView: (view: VisualYamlValue) => void
  isYamlValid: boolean
  className?: string
}

export const VisualYamlToggle = (props: VisualYamlToggleProps): JSX.Element => {
  const { view, setView, isYamlValid } = props

  const onChange = (value: VisualYamlValue) => {
    setView(value)
  }

  return (
    <ToggleGroup.Root
      variant="ghost"
      selectedVariant="secondary"
      onValueChange={onChange}
      value={view}
      size="xs"
      unselectable
    >
      <ToggleGroup.Item disabled={!isYamlValid} value="visual">
        {!isYamlValid && <IconV2 name="xmark-circle-solid" className="text-cn-foreground-danger" />}
        Visual
      </ToggleGroup.Item>
      <ToggleGroup.Item value="yaml">YAML</ToggleGroup.Item>
    </ToggleGroup.Root>
  )
}
