import { Label, Select } from '@/components'
import { ColorType, ContrastType, FullTheme, ModeType } from '@/context'

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
      <Select.Root
        name="contrast"
        placeholder="Select a theme contrast"
        value={contrast}
        onValueChange={(contrast: ContrastType) => {
          setTheme(`${mode}-${color}-${contrast}`)
        }}
      >
        <Select.Content defaultValue={contrast}>
          <Select.Item value={ContrastType.Standard}>Standard</Select.Item>
          <Select.Item value={ContrastType.Low}>Low</Select.Item>
          <Select.Item value={ContrastType.High}>High</Select.Item>
        </Select.Content>
      </Select.Root>
    </div>
  )
}
