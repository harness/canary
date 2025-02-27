import { Label, Select } from '@/components'
import { ColorType, ContrastType, FullTheme, ModeType } from '@/context'

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
      <Select.Root
        name="color"
        placeholder="Select a color theme"
        value={color}
        onValueChange={(color: ColorType) => {
          setTheme(`${mode}-${color}-${contrast}`)
        }}
      >
        <Select.Content defaultValue={color}>
          <Select.Item value={ColorType.Standard}>Standard</Select.Item>
          <Select.Separator />
          <Select.Group>
            <Select.Label>Vision Assistive</Select.Label>
            <Select.Item value={ColorType.Tritanopia}>Tritanopia</Select.Item>
            <Select.Item value={ColorType.ProtanopiaAndDeuteranopia}>Protanopia & Deuteranopia</Select.Item>
          </Select.Group>
        </Select.Content>
      </Select.Root>
    </div>
  )
}
