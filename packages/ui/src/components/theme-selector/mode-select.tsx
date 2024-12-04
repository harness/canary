import { Label, Select, SelectContent, SelectItem } from '..'
import { ColorType, ContrastType, FullTheme, ModeType } from './types'

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
      <Select
        name="mode"
        placeholder="Select a theme mode"
        value={mode}
        onValueChange={(mode: ModeType) => {
          setTheme(`${mode}-${color}-${contrast}`)
        }}
      >
        <SelectContent defaultValue={mode}>
          <SelectItem value={ModeType.Light}>Light</SelectItem>
          <SelectItem value={ModeType.Dark}>Dark</SelectItem>
          <SelectItem value={ModeType.System}>System</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
