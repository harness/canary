import { IconPropsV2, ToggleGroup } from '@harnessio/ui/components'
import type { VisualYamlValue } from '@harnessio/yaml-editor'

// Re-export from yaml-editor for backward compatibility
export type { VisualYamlValue } from '@harnessio/yaml-editor'

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

  const prefixIcon = !isYamlValid ? 'xmark-circle-solid' : undefined

  const prefixIconProps: IconPropsV2 | undefined = !isYamlValid
    ? { name: 'xmark-circle-solid', className: 'text-cn-danger' }
    : undefined

  return (
    <ToggleGroup.Root
      variant="ghost"
      selectedVariant="secondary"
      onChange={onChange as (value: string) => void}
      value={view}
      size="xs"
      unselectable
    >
      <ToggleGroup.Item
        disabled={!isYamlValid}
        value="visual"
        text="Visual"
        prefixIcon={prefixIcon}
        prefixIconProps={prefixIconProps}
      />
      <ToggleGroup.Item value="yaml" text="YAML" />
    </ToggleGroup.Root>
  )
}
