import { Label, Select } from '@/components'
import { ColorType, ContrastType, FullTheme, ModeType } from '@/context'

export function ModeSelect({
  setTheme,
  mode,
  color,
  contrast
}: {
  setTheme: (theme: FullTheme) => void
  mode: ModeType
  color: ColorType
  contrast: ContrastType
}) {
  return (
    <div>
      <Label className="text-xs">Mode</Label>
      <Select.Root
        name="mode"
        placeholder="Select a theme mode"
        value={mode}
        onValueChange={(mode: ModeType) => {
          setTheme(`${mode}-${color}-${contrast}`)
        }}
      >
        <Select.Content defaultValue={mode}>
          <Select.Item value={ModeType.Light}>Light</Select.Item>
          <Select.Item value={ModeType.Dark}>Dark</Select.Item>
          <Select.Item value={ModeType.System}>System</Select.Item>
        </Select.Content>
      </Select.Root>
    </div>
  )
}
