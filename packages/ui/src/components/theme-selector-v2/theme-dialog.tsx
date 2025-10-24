import { FC, useEffect, useState } from 'react'

import { Dialog, Icon, Select, Separator } from '@/components'
import darkModeImage from '@/svgs/theme-dark.png'
import lightModeImage from '@/svgs/theme-light.png'
import { cn } from '@/utils/cn'

import { AccentColor, ColorAdjustment, Contrast, GrayColor, Mode, ThemeDialogProps } from './types'

const ThemeDialog: FC<ThemeDialogProps> = ({ defaultTheme, theme, open, onOpenChange, onChange, children }) => {
  const [mode, setMode] = useState<Mode>(Mode.Dark)
  const [contrast, setContrast] = useState<Contrast>(Contrast.Default)
  const [colorAdjustment, setColorAdjustment] = useState<ColorAdjustment>(ColorAdjustment.Default)
  const [accentColor, setAccentColor] = useState<AccentColor>(AccentColor.Blue)
  const [grayColor, setGrayColor] = useState<GrayColor>(GrayColor.First)

  useEffect(() => {
    if (theme) {
      setMode(theme.mode)
      setContrast(theme.contrast)
      setColorAdjustment(theme.colorAdjustment)
      setAccentColor(theme.accentColor)
      setGrayColor(theme.grayColor)
    } else if (defaultTheme) {
      setMode(defaultTheme.mode)
      setContrast(defaultTheme.contrast)
      setColorAdjustment(defaultTheme.colorAdjustment)
      setAccentColor(defaultTheme.accentColor)
      setGrayColor(defaultTheme.grayColor)
    }
  }, [defaultTheme, theme])

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      {!!children && <Dialog.Trigger asChild>{children}</Dialog.Trigger>}
      <Dialog.Content className="max-w-[538px]">
        <Dialog.Title className="text-20 font-medium">Appearance settings</Dialog.Title>
        {/* Mode */}
        <div className="mt-1 flex flex-col gap-y-5">
          <div className="flex flex-col">
            <span className="text-16 font-medium text-foreground-1">Mode</span>
            <p className="mt-1.5 text-14 leading-snug text-foreground-3">
              Choose Dark mode for low light or Light mode for bright spaces.
            </p>
            <div className="mt-[18px] grid grid-cols-2 gap-x-4">
              {Object.values(Mode).map(item => {
                return (
                  <button
                    className="flex flex-col gap-y-2 focus-visible:outline-none"
                    key={item}
                    onClick={() => {
                      setMode(item)
                      onChange({ mode: item, contrast, colorAdjustment, accentColor, grayColor })
                    }}
                  >
                    <div className="relative">
                      <img
                        src={item === Mode.Dark ? darkModeImage : lightModeImage}
                        alt=""
                        className={cn(
                          'w-full h-auto rounded border',
                          mode === item ? 'border-borders-accent' : 'border-borders-4'
                        )}
                      />
                      {mode === item && (
                        <Icon className="absolute bottom-2 left-2 text-foreground-1" name="checkbox-circle" size={16} />
                      )}
                      <div
                        className="absolute right-[27px] top-[61px] h-2 w-9 rounded-sm"
                        style={{
                          backgroundColor:
                            accentColor === AccentColor.White
                              ? item === Mode.Light
                                ? 'hsla(240, 6%, 40%, 1)'
                                : 'hsla(240, 9%, 67%, 1)'
                              : accentColor
                        }}
                        aria-hidden
                      />
                    </div>
                    <span className="text-14 leading-tight text-foreground-1">{item}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <Separator className="h-px bg-borders-4" />

          {/* Contrast */}
          <div className="grid grid-cols-[246px_1fr] gap-x-8">
            <div>
              <span className="text-16 font-medium text-foreground-1">Contrast</span>
              <p className="mt-1.5 text-14 leading-snug text-foreground-3">
                High contrast improves readability, Dimmer mode reduces glare.
              </p>
            </div>
            <Select.Root
              name="contrast"
              value={contrast}
              onValueChange={(value: Contrast) => {
                setContrast(value)
                onChange({ contrast: value, mode, colorAdjustment, accentColor, grayColor })
              }}
              placeholder="Select"
            >
              <Select.Content>
                {Object.values(Contrast).map(item => (
                  <Select.Item key={item} value={item}>
                    {item}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </div>

          <Separator className="h-px bg-borders-4" />

          {/* Color Adjustment */}
          <div className="grid grid-cols-[246px_1fr] gap-x-8">
            <div>
              <span className="text-16 font-medium text-foreground-1">Color adjustment</span>
              <p className="mt-1.5 text-14 leading-snug text-foreground-3">
                Adjust colors for different types of color blindness.
              </p>
            </div>
            <Select.Root
              name="color-adjustment"
              value={colorAdjustment}
              onValueChange={(value: ColorAdjustment) => {
                setColorAdjustment(value)
                onChange({ colorAdjustment: value, mode, contrast, accentColor, grayColor })
              }}
              placeholder="Select"
            >
              <Select.Content>
                {Object.values(ColorAdjustment).map(item => (
                  <Select.Item key={item} value={item}>
                    {item}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </div>

          <Separator className="h-px bg-borders-4" />

          {/* Accent Color */}
          <div className="grid grid-cols-[246px_1fr] gap-x-8">
            <div>
              <span className="text-16 font-medium text-foreground-1">Accent color</span>
              <p className="mt-1.5 text-14 leading-snug text-foreground-3">Select your application accent color.</p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {Object.values(AccentColor).map(item => (
                <button
                  key={item}
                  className={cn(
                    'focus-visible:rounded-full h-[26px] w-[26px] rounded-full',
                    accentColor === item && 'border border-borders-8'
                  )}
                  onClick={() => {
                    setAccentColor(item)
                    onChange({ accentColor: item, mode, contrast, colorAdjustment, grayColor })
                  }}
                >
                  <span
                    style={{
                      backgroundColor:
                        item === AccentColor.White && mode === Mode.Light ? 'hsla(240, 6%, 40%, 1)' : item
                    }}
                    className="m-auto block size-[18px] rounded-full"
                  />
                </button>
              ))}
            </div>
          </div>

          <Separator className="h-px bg-borders-4" />

          {/* Gray Color */}
          <div className="grid grid-cols-[246px_1fr] gap-x-8">
            <div>
              <span className="text-16 font-medium text-foreground-1">Gray color</span>
              <p className="mt-1.5 text-14 leading-snug text-foreground-3">Select your application gray color.</p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {Object.values(GrayColor).map(item => (
                <button
                  key={item}
                  className={cn(
                    'focus-visible:rounded-full h-[26px] w-[26px] rounded-full',
                    grayColor === item && 'border border-borders-8'
                  )}
                  onClick={() => {
                    setGrayColor(item)
                    onChange({ grayColor: item, mode, contrast, colorAdjustment, accentColor })
                  }}
                >
                  <span style={{ backgroundColor: item }} className="m-auto block size-[18px] rounded-full" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  )
}

export { ThemeDialog }
