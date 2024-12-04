import { Label, Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectSeparator } from '..'
import { ColorType, ContrastType, FullTheme, ModeType } from './types'

export function ColorSelect({
  setTheme,
  mode,
  color,
  contrast
}: {
  setTheme: (theme: FullTheme) => void
  color: ColorType
  mode: ModeType
  contrast: ContrastType
}) {
  return (
    <div>
      <Label className="text-xs">Color</Label>
      <Select
        name="color"
        placeholder="Select a color theme"
        value={color}
        onValueChange={(color: ColorType) => {
          setTheme(`${mode}-${color}-${contrast}`)
        }}
      >
        <SelectContent defaultValue={color}>
          <SelectItem value={ColorType.Standard}>Standard</SelectItem>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>Vision Assistive</SelectLabel>
            <SelectItem value={ColorType.Tritanopia}>Tritanopia</SelectItem>
            <SelectItem value={ColorType.ProtanopiaAndDeuteranopia}>Protanopia & Deuteranopia</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}
