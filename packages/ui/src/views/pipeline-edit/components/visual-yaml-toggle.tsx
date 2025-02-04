import { Icon, ToggleGroup, ToggleGroupItem } from '@/components'

export type VisualYamlValue = 'visual' | 'yaml'

interface VisualYamlToggleProps {
  view: VisualYamlValue
  setView: (view: VisualYamlValue) => void
  isYamlValid: boolean
}

export const VisualYamlToggle = (props: VisualYamlToggleProps): JSX.Element => {
  const { view, setView, isYamlValid } = props
  return (
    <ToggleGroup
      onValueChange={value => {
        if (value) {
          setView(value as VisualYamlValue)
        }
      }}
      value={view}
      type="single"
      unselectable={'on'}
      className={'rounded-lg border border-primary/10 bg-primary-foreground p-0.5'}
    >
      <ToggleGroupItem
        disabled={!isYamlValid}
        value={'visual'}
        className="h-7 rounded-md border border-transparent text-xs font-medium disabled:opacity-100 data-[state=on]:border-primary/10"
      >
        {!isYamlValid && <Icon name="fail" className="mr-1 text-destructive" />}
        Visual
      </ToggleGroupItem>
      <ToggleGroupItem
        value={'yaml'}
        className="h-7 rounded-md border border-transparent text-xs font-medium text-tertiary-background data-[state=on]:border-white/10 data-[state=on]:text-primary"
      >
        YAML
      </ToggleGroupItem>
    </ToggleGroup>
  )
}
