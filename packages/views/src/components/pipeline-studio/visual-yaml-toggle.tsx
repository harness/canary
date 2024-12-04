import { Icon, ToggleGroup, ToggleGroupItem } from '@harnessio/canary'

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
      className={'bg-primary-foreground border-primary/10 rounded-lg border p-0.5'}
    >
      <ToggleGroupItem
        disabled={!isYamlValid}
        value={'visual'}
        className="data-[state=on]:border-primary/10 h-7 rounded-md border border-transparent text-xs font-medium disabled:opacity-100"
      >
        {!isYamlValid && <Icon name="fail" className="text-destructive mr-1" />}
        Visual
      </ToggleGroupItem>
      <ToggleGroupItem
        value={'yaml'}
        className="text-tertiary-background data-[state=on]:text-primary h-7 rounded-md border border-transparent text-xs font-medium data-[state=on]:border-white/10"
      >
        YAML
      </ToggleGroupItem>
    </ToggleGroup>
  )
}
