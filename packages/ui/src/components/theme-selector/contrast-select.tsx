import { Label, Select, SelectContent, SelectItem } from '..'
import { ColorType, ContrastType, FullTheme, ModeType } from './types'

export function ContrastSelect({
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
      <Label className="text-xs">Contrast</Label>
      <Select
        name="contrast"
        placeholder="Select a theme contrast"
        value={contrast}
        onValueChange={(contrast: ContrastType) => {
          setTheme(`${mode}-${color}-${contrast}`)
        }}
      >
        <SelectContent defaultValue={contrast}>
          <SelectItem value={ContrastType.Standard}>Standard</SelectItem>
          <SelectItem value={ContrastType.Low}>Low</SelectItem>
          <SelectItem value={ContrastType.High}>High</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
