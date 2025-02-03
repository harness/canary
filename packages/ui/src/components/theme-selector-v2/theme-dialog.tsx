import { FC, useEffect, useState } from 'react'

import { Dialog, Select, SelectContent, SelectItem, Separator } from '@/components'
import { cn } from '@/utils/cn'

import { AccentColor, ColorAdjustment, Contrast, Mode, ThemeDialogProps } from './types'

const ThemeDialog: FC<ThemeDialogProps> = ({ defaultTheme, theme, open, onOpenChange, onChange, children }) => {
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
      {!!children && <Dialog.Trigger asChild>{children}</Dialog.Trigger>}
      <Dialog.Content className="max-w-[538px]">
        <Dialog.Title className="text-20 font-medium">Appearance Settings</Dialog.Title>
        {/* Mode */}
        <div className="mt-1 grid grid-cols-[246px_1fr] gap-x-8">
          <div>
            <span className="text-16 font-medium text-foreground-1">Mode</span>
            <p className="mt-1.5 text-14 leading-snug text-foreground-3">
              Choose Dark mode for low light or Light mode for bright spaces.
            </p>
          </div>
          <Select name="mode" value={mode} onValueChange={(value: Mode) => setMode(value)} placeholder="Select">
            <SelectContent>
              {Object.values(Mode).map(item => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Separator className="h-px bg-[#1D1D20]" />

        {/* Contrast */}
        <div className="grid grid-cols-[246px_1fr] gap-x-8">
          <div>
            <span className="text-16 font-medium text-foreground-1">Contrast</span>
            <p className="mt-1.5 text-14 leading-snug text-foreground-3">
              High contrast improves readability, Dimmer mode reduces glare.
            </p>
          </div>
          <Select
            name="contrast"
            value={contrast}
            onValueChange={(value: Contrast) => setContrast(value)}
            placeholder="Select"
          >
            <SelectContent>
              {Object.values(Contrast).map(item => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Separator className="h-px bg-[#1D1D20]" />

        {/* Color Adjustment */}
        <div className="grid grid-cols-[246px_1fr] gap-x-8">
          <div>
            <span className="text-16 font-medium text-foreground-1">Color Adjustment</span>
            <p className="mt-1.5 text-14 leading-snug text-foreground-3">
              Adjust colors for different types of color blindness.
            </p>
          </div>
          <Select
            name="color-adjustment"
            value={colorAdjustment}
            onValueChange={(value: ColorAdjustment) => setColorAdjustment(value)}
            placeholder="Select"
          >
            <SelectContent>
              {Object.values(ColorAdjustment).map(item => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Separator className="h-px bg-[#1D1D20]" />

        {/* Accent Color */}
        <div className="grid grid-cols-[246px_1fr] gap-x-8">
          <div>
            <span className="text-16 font-medium text-foreground-1">Accent Color</span>
            <p className="mt-1.5 text-14 leading-snug text-foreground-3">Select your application accent color.</p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {Object.values(AccentColor).map(item => (
              <button
                key={item}
                className={cn(
                  'focus-visible:rounded-full h-[26px] w-[26px] rounded-full',
                  accentColor === item && 'border border-white'
                )}
                onClick={() => {
                  setAccentColor(item)
                  onChange({ accentColor: item, mode, contrast, colorAdjustment })
                }}
              >
                <span style={{ backgroundColor: item }} className="m-auto block size-[18px] rounded-full" />
              </button>
            ))}
          </div>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  )
}

export { ThemeDialog }
