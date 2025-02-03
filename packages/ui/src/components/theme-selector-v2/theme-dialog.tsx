import { FC } from 'react'

import { Button, ButtonGroup, Dialog, Separator, Text } from '@/components'
import { cn } from '@/utils/cn'

import { AccentColor, ColorAdjustment, Contrast, Mode, ThemeDialogProps } from './types'

const ThemeDialog: FC<ThemeDialogProps> = ({
  defaultTheme,
  theme: appliedTheme,
  open,
  onOpenChange,
  onChange,
  onSave,
  onCancel,
  children
}) => {
  const theme = appliedTheme ||
    defaultTheme || {
      mode: Mode.Dark,
      contrast: Contrast.Default,
      colorAdjustment: ColorAdjustment.Default,
      accentColor: AccentColor.Blue
    }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Content className="w-[550px]">
        <Dialog.Title>Appearance Settings</Dialog.Title>
        {/* Mode */}
        <div>
          <div className="flex flex-col gap-1">
            <Text className="text-md font-medium">Mode</Text>
            <Text className="text-xs text-foreground-3">Select or customize your UI theme.</Text>
          </div>
          <div className="mt-4 flex gap-4">
            {Object.values(Mode).map(item => (
              <label key={item} className="flex flex-col items-start cursor-pointer gap-2">
                <div
                  className={cn(
                    'h-[131px] w-[225px] rounded border p-2',
                    theme.mode === item ? 'border-white' : 'border-gray-600',
                    item === Mode.Light ? 'bg-gray-300' : 'bg-black'
                  )}
                />
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="theme"
                    value={item}
                    checked={theme.mode === item}
                    onChange={() => onChange({ ...theme, mode: item })}
                    className="hidden"
                  />
                  <div className="h-4 w-4 rounded-full border border-gray-600 flex items-center justify-center">
                    {theme.mode === item && <div className="h-2 w-2 rounded-full bg-white" />}
                  </div>
                  {item}
                </div>
              </label>
            ))}
          </div>
        </div>

        <Separator className="h-px bg-gray-800" />

        {/* Contrast */}
        <div>
          <div className="flex flex-col gap-1">
            <Text className="text-md font-medium">Contrast</Text>
            <Text className="text-xs text-foreground-3">
              High contrast improves readability, Dimmer mode reduces glare.
            </Text>
          </div>
          <div className="mt-4 flex gap-2">
            {Object.values(Contrast).map(item => (
              <label key={item} className="flex cursor-pointer items-center gap-2">
                <input
                  type="radio"
                  name="contrast"
                  value={item}
                  checked={theme.contrast === item}
                  onChange={() => onChange({ ...theme, contrast: item })}
                  className="hidden"
                />
                <div className="h-4 w-4 rounded-full border border-gray-600 flex items-center justify-center">
                  {theme.contrast === item && <div className="h-2 w-2 rounded-full bg-white" />}
                </div>
                <span className="text-gray-300">{item}</span>
              </label>
            ))}
          </div>
        </div>

        <Separator className="h-px bg-gray-800" />

        {/* Color Adjustment */}
        <div>
          <div className="flex flex-col gap-1">
            <Text className="text-md font-medium">Color Adjustment</Text>
            <Text className="text-xs text-foreground-3">Adjust colors for different types of vision deficiencies.</Text>
          </div>
          <div className="mt-4 flex gap-2">
            {Object.values(ColorAdjustment).map(item => (
              <label key={item} className="flex cursor-pointer items-center gap-2">
                <input
                  type="radio"
                  name="color-adjustment"
                  value={item}
                  checked={theme.colorAdjustment === item}
                  onChange={() => onChange({ ...theme, colorAdjustment: item })}
                  className="hidden"
                />
                <div className="h-4 w-4 rounded-full border border-gray-600 flex items-center justify-center">
                  {theme.colorAdjustment === item && <div className="h-2 w-2 rounded-full bg-white" />}
                </div>
                <span className="text-gray-300">{item}</span>
              </label>
            ))}
          </div>
        </div>

        <Separator className="h-px bg-gray-800" />

        {/* Accent Color */}
        <div>
          <div className="flex flex-col gap-1">
            <Text className="text-md font-medium">Accent Color</Text>
            <Text className="text-xs text-foreground-3">Select your application accent color.</Text>
          </div>
          <div className="mt-4 flex gap-2">
            {Object.values(AccentColor).map(item => (
              <button
                key={item}
                className={cn(
                  'h-6 w-6 rounded-full border',
                  theme.accentColor === item ? 'border-white' : 'border-gray-600'
                )}
                style={{ backgroundColor: item }}
                onClick={() => onChange({ ...theme, accentColor: item })}
              />
            ))}
          </div>
        </div>

        {/* Buttons */}
        <Dialog.Footer>
          <ButtonGroup>
            <Button variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" onClick={() => onSave(theme)}>
              Save preferences
            </Button>
          </ButtonGroup>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  )
}

export { ThemeDialog }
