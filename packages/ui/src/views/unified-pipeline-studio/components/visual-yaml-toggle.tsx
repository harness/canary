import { Icon, ToggleGroup } from '@/components'
import { useTheme } from '@/context'
import { cn } from '@utils/cn'

export type VisualYamlValue = 'visual' | 'yaml'

interface VisualYamlToggleProps {
  view: VisualYamlValue
  setView: (view: VisualYamlValue) => void
  isYamlValid: boolean
  className?: string
}

export const VisualYamlToggle = (props: VisualYamlToggleProps): JSX.Element => {
  const { view, setView, isYamlValid, className } = props
  const { isLightTheme } = useTheme()
  return (
    <ToggleGroup.Root
      className={cn(
        'h-8 rounded-md border px-1 bg-cn-background-3 inline-flex',
        isLightTheme ? 'border-cn-borders-5' : 'border-cn-borders-2',
        className
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
        className="rounded text-2 disabled:opacity-100"
        size="xs"
      >
        {!isYamlValid && <Icon name="fail-legacy" className="mr-1 text-cn-foreground-danger" />}
        Visual
      </ToggleGroup.Item>
      <ToggleGroup.Item value="yaml" className="rounded text-2" size="xs">
        YAML
      </ToggleGroup.Item>
    </ToggleGroup.Root>
  )
}
