import { FC, useEffect, useState } from 'react'

import { Dialog, getModeColorContrastFromFullTheme, Icon, Select, Separator } from '@/components'
import { ColorType, ContentStyleType, ContrastType, ModeType } from '@/context/theme'
import darkModeImage from '@/svgs/theme-dark.png'
import lightModeImage from '@/svgs/theme-light.png'
import { cn } from '@/utils/cn'

import { AccentColor, GrayColor, ThemeDialogProps } from './types'

const ThemeDialog: FC<ThemeDialogProps> = ({
  theme,
  isInset,
  setTheme,
  open,
  onOpenChange,
  onInsetChange,
  children,
  showSystemMode,
  showAccentColor,
  showGrayColor
}) => {
  const [accentColor, setAccentColor] = useState<AccentColor>(AccentColor.Blue)
  const [grayColor, setGrayColor] = useState<GrayColor>(GrayColor.First)

  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  const [systemMode, setSystemMode] = useState<ModeType>(mediaQuery.matches ? ModeType.Dark : ModeType.Light)
  useEffect(() => {
    const updateSystemTheme = () => {
      setSystemMode(mediaQuery.matches ? ModeType.Dark : ModeType.Light)
    }

    mediaQuery.addEventListener('change', updateSystemTheme)

    return () => {
      mediaQuery.removeEventListener('change', updateSystemTheme)
    }
  }, [])

  const { mode, color: colorAdjustment, contrast } = getModeColorContrastFromFullTheme(theme)

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      {!!children && <Dialog.Trigger asChild>{children}</Dialog.Trigger>}
      <Dialog.Content className="max-w-[538px]">
        <Dialog.Title className="text-20 font-medium">Appearance settings</Dialog.Title>
        {/* Mode */}
        <div className="mt-1 flex flex-col gap-y-5">
          <div className="flex flex-col">
            <span className="text-16 text-foreground-1 font-medium">Mode</span>
            <p className="text-14 text-foreground-3 mt-1.5 leading-snug">
              Choose Dark mode for low light or Light mode for bright spaces.
            </p>
            <div className="mt-[18px] grid grid-cols-2 gap-4">
              {Object.entries(ModeType).map(([key, value]) => {
                if (!showSystemMode && value === ModeType.System) return null
                const valueMode = value === ModeType.System ? systemMode : value
                return (
                  <button
                    className="flex flex-col gap-y-2 focus-visible:outline-none"
                    key={key}
                    onClick={() => {
                      setTheme(`${value}-${colorAdjustment}-${contrast}`)
                    }}
                  >
                    <div className="relative">
                      <img
                        src={valueMode === ModeType.Dark ? darkModeImage : lightModeImage}
                        alt=""
                        className={cn(
                          'w-full h-auto rounded border',
                          mode === value ? 'border-borders-accent' : 'border-borders-4'
                        )}
                      />
                      {mode === value && (
                        <Icon className="text-foreground-1 absolute bottom-2 left-2" name="checkbox-circle" size={16} />
                      )}
                      <div
                        className="absolute right-[27px] top-[61px] h-2 w-9 rounded-sm"
                        style={{
                          backgroundColor:
                            accentColor === AccentColor.White
                              ? value === ModeType.Light
                                ? 'hsla(240, 6%, 40%, 1)'
                                : 'hsla(240, 9%, 67%, 1)'
                              : accentColor
                        }}
                        aria-hidden
                      />
                    </div>
                    <span className="text-14 text-foreground-1 leading-tight">{key}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <Separator className="bg-borders-4 h-px" />

          {/* Contrast */}
          <div className="grid grid-cols-[246px_1fr] gap-x-8">
            <div>
              <span className="text-16 text-foreground-1 font-medium">Contrast</span>
              <p className="text-14 text-foreground-3 mt-1.5 leading-snug">
                High contrast improves readability, Dimmer mode reduces glare.
              </p>
            </div>
            <Select.Root
              name="contrast"
              value={contrast}
              onValueChange={(value: ContrastType) => {
                setTheme(`${mode}-${colorAdjustment}-${value}`)
              }}
              placeholder="Select"
            >
              <Select.Content>
                {Object.entries(ContrastType).map(([key, value]) => (
                  <Select.Item key={value} value={value}>
                    {key}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </div>

          <Separator className="bg-borders-4 h-px" />

          {/* Color Adjustment */}
          <div className="grid grid-cols-[246px_1fr] gap-x-8">
            <div>
              <span className="text-16 text-foreground-1 font-medium">Color adjustment</span>
              <p className="text-14 text-foreground-3 mt-1.5 leading-snug">
                Adjust colors for different types of color blindness.
              </p>
            </div>
            <Select.Root
              name="color-adjustment"
              value={colorAdjustment}
              onValueChange={(value: ColorType) => {
                setTheme(`${mode}-${value}-${contrast}`)
              }}
              placeholder="Select"
            >
              <Select.Content>
                {Object.entries(ColorType).map(([key, value]) => (
                  <Select.Item key={value} value={value}>
                    {key}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </div>

          <Separator className="bg-borders-4 h-px" />

          {/* Inset Adjustment */}
          <div className="grid grid-cols-[246px_1fr] gap-x-8">
            <div>
              <span className="text-16 text-foreground-1 font-medium">Content style</span>
              <p className="text-14 text-foreground-3 mt-1.5 leading-snug">Choose the style of the content area.</p>
            </div>
            <Select.Root
              name="color-adjustment"
              value={isInset ? ContentStyleType.Inset : ContentStyleType.Default}
              onValueChange={onInsetChange}
              placeholder="Select"
            >
              <Select.Content>
                {Object.values(ContentStyleType).map(value => (
                  <Select.Item key={value} value={value}>
                    {value === ContentStyleType.Inset ? 'Inset' : 'Default'}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </div>

          {/* Accent Color */}
          {showAccentColor ? (
            <>
              <Separator className="bg-borders-4 h-px" />
              <div className="grid grid-cols-[246px_1fr] gap-x-8">
                <div>
                  <span className="text-16 text-foreground-1 font-medium">Accent color</span>
                  <p className="text-14 text-foreground-3 mt-1.5 leading-snug">Select your application accent color.</p>
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
                      }}
                    >
                      <span
                        style={{
                          backgroundColor:
                            item === AccentColor.White && mode === ModeType.Light ? 'hsla(240, 6%, 40%, 1)' : item
                        }}
                        className="m-auto block size-[18px] rounded-full"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : null}

          {/* Gray Color */}
          {showGrayColor ? (
            <>
              <Separator className="bg-borders-4 h-px" />
              <div className="grid grid-cols-[246px_1fr] gap-x-8">
                <div>
                  <span className="text-16 text-foreground-1 font-medium">Gray color</span>
                  <p className="text-14 text-foreground-3 mt-1.5 leading-snug">Select your application gray color.</p>
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
                      }}
                    >
                      <span style={{ backgroundColor: item }} className="m-auto block size-[18px] rounded-full" />
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : null}
        </div>
      </Dialog.Content>
    </Dialog.Root>
  )
}

export { ThemeDialog }
