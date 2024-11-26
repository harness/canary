import { Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '..'
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
        value={mode}
        onValueChange={(mode: ModeType) => {
          setTheme(`${mode}-${color}-${contrast}`)
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select a theme mode" />
        </SelectTrigger>
        <SelectContent defaultValue={mode}>
          <SelectItem value={ModeType.Light}>Light</SelectItem>
          <SelectItem value={ModeType.Dark}>Dark</SelectItem>
          <SelectItem value={ModeType.System}>System</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
