import { Icon, ToggleGroup } from '@/components'
import { useTheme } from '@/context'
import { cn } from '@utils/cn'

export type VisualYamlValue = 'visual' | 'yaml'

interface VisualYamlToggleProps {
  view: VisualYamlValue
  setView: (view: VisualYamlValue) => void
  isYamlValid: boolean
}

export const VisualYamlToggle = (props: VisualYamlToggleProps): JSX.Element => {
  const { view, setView, isYamlValid } = props
  const { isLightTheme } = useTheme()
  return (
    <ToggleGroup.Root
      className={cn(
        'h-8 rounded-md border px-1 bg-background-3',
        isLightTheme ? 'border-borders-5' : 'border-borders-1'
      )}
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
        className="text-13 rounded disabled:opacity-100"
        size="xs"
      >
        {!isYamlValid && <Icon name="fail-legacy" className="mr-1 text-destructive" />}
        Visual
      </ToggleGroup.Item>
      <ToggleGroup.Item value="yaml" className="text-13 rounded" size="xs">
        YAML
      </ToggleGroup.Item>
    </ToggleGroup.Root>
  )
}
