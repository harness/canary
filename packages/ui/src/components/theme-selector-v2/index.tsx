import { useEffect, useState } from 'react'

import { Button, ButtonGroup, Dialog, Separator, Text } from '@/components'
import { cn } from '@/utils/cn'

export interface ThemeInterface {
  mode: Mode
  contrast: Contrast
  colorAdjustment: ColorAdjustment
  accentColor: AccentColor
}

export enum Mode {
  Dark = 'Dark',
  Light = 'Light'
}

export enum Contrast {
  Default = 'Default',
  HighContrast = 'High Contrast',
  Dimmer = 'Dimmer'
}

export enum ColorAdjustment {
  Default = 'Default',
  Protanopia = 'Protanopia',
  Deuteranopia = 'Deuteranopia',
  Tritanopia = 'Tritanopia'
}

export enum AccentColor {
  Yellow = 'yellow',
  Red = 'red',
  Pink = 'pink',
  Purple = 'purple',
  Blue = 'blue',
  Cyan = 'cyan',
  Orange = 'orange',
  Brown = 'brown',
  Green = 'green'
}

interface ThemeDialogProps {
  defaultTheme?: ThemeInterface
  theme?: ThemeInterface
  open: boolean
  onOpenChange: (open: boolean) => void
  onChange: (language: Partial<ThemeInterface>) => void
  onSave: (language: ThemeInterface) => void
  onCancel: () => void
  children: React.ReactNode
}

const ThemeDialog: React.FC<ThemeDialogProps> = ({
  defaultTheme,
  theme,
  open,
  onOpenChange,
  onChange,
  onSave,
  onCancel,
  children
}) => {
  const [mode, setMode] = useState<Mode>(Mode.Dark)
  const [contrast, setContrast] = useState<Contrast>(Contrast.Default)
  const [colorAdjustment, setColorAdjustment] = useState<ColorAdjustment>(ColorAdjustment.Default)
  const [accentColor, setAccentColor] = useState<AccentColor>(AccentColor.Blue)

  useEffect(() => {
    if (theme) {
      setMode(theme.mode)
      setContrast(theme.contrast)
      setColorAdjustment(theme.colorAdjustment)
      setAccentColor(theme.accentColor)
    } else if (defaultTheme) {
      setMode(defaultTheme.mode)
      setContrast(defaultTheme.contrast)
      setColorAdjustment(defaultTheme.colorAdjustment)
      setAccentColor(defaultTheme.accentColor)
    }
  }, [defaultTheme, theme])

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Content className="w-[550px]">
        <Dialog.Title>Appearance Settings</Dialog.Title>
        {/* Mode */}
        <div>
          <div className="flex flex-col">
            <Text className="text-lg font-medium">Mode</Text>
            <Text className="text-xs text-foreground-3">Select or customize your UI theme.</Text>
          </div>
          <div className="mt-4 flex gap-4">
            {Object.values(Mode).map(item => (
              <label key={item} className="flex flex-col items-start cursor-pointer gap-2">
                <div
                  className={cn(
                    'h-[131px] w-[225px] rounded border p-2',
                    mode === item ? 'border-white' : 'border-gray-600',
                    item === Mode.Light ? 'bg-gray-300' : 'bg-black'
                  )}
                />
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="theme"
                    value={item}
                    checked={mode === item}
                    onChange={() => {
                      setMode(item)
                      onChange({ mode: item })
                    }}
                    className="hidden"
                  />
                  <div className="h-4 w-4 rounded-full border border-gray-600 flex items-center justify-center">
                    {mode === item && <div className="h-2 w-2 rounded-full bg-white" />}
                  </div>
                  {item}
                </div>
              </label>
            ))}
          </div>
        </div>

        <Separator className="h-px bg-gray-600" />

        {/* Contrast */}
        <div>
          <div className="flex flex-col">
            <Text className="text-lg font-medium">Contrast</Text>
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
                  checked={contrast === item}
                  onChange={() => {
                    setContrast(item)
                    onChange({ contrast: item })
                  }}
                  className="hidden"
                />
                <div className="h-4 w-4 rounded-full border border-gray-600 flex items-center justify-center">
                  {contrast === item && <div className="h-2 w-2 rounded-full bg-white" />}
                </div>
                <span className="text-gray-300">{item}</span>
              </label>
            ))}
          </div>
        </div>

        <Separator className="h-px bg-gray-600" />

        {/* Color Adjustment */}
        <div>
          <div className="flex flex-col">
            <Text className="text-lg font-medium">Color Adjustment</Text>
            <Text className="text-xs text-foreground-3">Adjust colors for different types of color blindness.</Text>
          </div>
          <div className="mt-4 flex gap-2">
            {Object.values(ColorAdjustment).map(item => (
              <label key={item} className="flex cursor-pointer items-center gap-2">
                <input
                  type="radio"
                  name="color-adjustment"
                  value={item}
                  checked={colorAdjustment === item}
                  onChange={() => {
                    setColorAdjustment(item)
                    onChange({ colorAdjustment: item })
                  }}
                  className="hidden"
                />
                <div className="h-4 w-4 rounded-full border border-gray-600 flex items-center justify-center">
                  {colorAdjustment === item && <div className="h-2 w-2 rounded-full bg-white" />}
                </div>
                <span className="text-gray-300">{item}</span>
              </label>
            ))}
          </div>
        </div>

        <Separator className="h-px bg-gray-600" />

        {/* Accent Color */}
        <div>
          <div className="flex flex-col">
            <Text className="text-lg font-medium">Accent Color</Text>
            <Text className="text-xs text-foreground-3">Select your application accent color.</Text>
          </div>
          <div className="mt-4 flex gap-2">
            {Object.values(AccentColor).map(item => (
              <button
                key={item}
                className={cn('h-6 w-6 rounded-full border', accentColor === item ? 'border-white' : 'border-gray-600')}
                style={{ backgroundColor: item }}
                onClick={() => {
                  setAccentColor(item)
                  onChange({ accentColor: item })
                }}
              />
            ))}
          </div>
        </div>

        {/* Buttons */}
        <Dialog.Footer>
          <ButtonGroup>
            <>
              <Button variant="secondary" onClick={onCancel}>
                Cancel
              </Button>
              <Button onClick={() => onSave({ mode, contrast, colorAdjustment, accentColor })}>Save preferences</Button>
            </>
          </ButtonGroup>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  )
}

export { ThemeDialog }
