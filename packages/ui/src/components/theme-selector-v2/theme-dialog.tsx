import { FC, useEffect, useState } from 'react'

import {
  Dialog,
  getModeColorContrastFromFullTheme,
  IconV2,
  Select,
  SelectValueOption,
  Separator,
  Text
} from '@/components'
import { ColorType, ContrastType, ModeType } from '@/context/theme'
import darkModeImage from '@/svgs/theme-dark.png'
import lightModeImage from '@/svgs/theme-light.png'
import { cn } from '@/utils/cn'

import { AccentColor, GrayColor, ThemeDialogProps } from './types'

const contrastOptions: SelectValueOption<ContrastType>[] = Object.entries(ContrastType).map(([key, value]) => ({
  label: key,
  value
}))

const colorOptions: SelectValueOption<ColorType>[] = Object.entries(ColorType).map(([key, value]) => ({
  label: key,
  value
}))

const ThemeDialog: FC<ThemeDialogProps> = ({
  theme,
  setTheme,
  open,
  onOpenChange,
  children,
  showSystemMode,
  showAccentColor,
  showGrayColor,
  showAccessibilityThemeOptions = false
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

  /**
   * Hiding accessibility theme options till we
   * complete the new design system migration.
   */
  const isAccessibilityThemeEnabled = showAccessibilityThemeOptions

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      {!!children && <Dialog.Trigger asChild>{children}</Dialog.Trigger>}
      <Dialog.Content size="md">
        <Dialog.Header>
          <Dialog.Title>Appearance settings</Dialog.Title>
        </Dialog.Header>
        <Dialog.Body>
          <div className="flex flex-col">
            <Text variant="heading-base">Mode</Text>
            <Text className="mt-1.5" color="foreground-3">
              Choose Dark mode for low light or Light mode for bright spaces.
            </Text>
            <div className="mt-[18px] grid grid-cols-2 gap-4">
              {Object.entries(ModeType).map(([key, value]) => {
                if (!showSystemMode && value === ModeType.System) return null
                const valueMode = value === ModeType.System ? systemMode : value
                // TODO: Design system: Update buttons here.
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
                          mode === value ? 'border-cn-brand' : 'border-cn-3'
                        )}
                      />
                      {mode === value && (
                        <IconV2 className="text-cn-foreground-1 absolute bottom-2 left-2" name="check-circle-solid" />
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
                    <span className="text-2 text-cn-foreground-1 leading-tight">{key}</span>
                  </button>
                )
              })}
            </div>
          </div>
          {isAccessibilityThemeEnabled && (
            <>
              <Separator className="bg-cn-background-2 h-px" />

              {/* Contrast */}
              <div className="grid grid-cols-[246px_1fr] gap-x-8">
                <div>
                  <Text variant="heading-base">Contrast</Text>
                  <Text className="mt-1.5" color="foreground-3">
                    High contrast improves readability, Dimmer mode reduces glare.
                  </Text>
                </div>

                <Select
                  value={contrast}
                  options={contrastOptions}
                  onChange={(value: ContrastType) => setTheme(`${mode}-${colorAdjustment}-${value}`)}
                  placeholder="Select"
                />
              </div>

              <Separator className="bg-cn-background-2 h-px" />

              {/* Color Adjustment */}
              <div className="grid grid-cols-[246px_1fr] gap-x-8">
                <div>
                  <Text variant="heading-base">Color adjustment</Text>
                  <Text className="mt-1.5" color="foreground-3">
                    Adjust colors for different types of color blindness.
                  </Text>
                </div>

                <Select
                  value={colorAdjustment}
                  options={colorOptions}
                  onChange={(value: ColorType) => setTheme(`${mode}-${value}-${contrast}`)}
                  placeholder="Select"
                />
              </div>

              <Separator className="bg-cn-background-2 h-px" />

              {/* Accent Color */}
              {showAccentColor ? (
                <>
                  <Separator className="bg-cn-background-2 h-px" />
                  <div className="grid grid-cols-[246px_1fr] gap-x-8">
                    <div>
                      <Text variant="heading-base">Accent color</Text>
                      <Text className="mt-1.5" color="foreground-3">
                        Select your application accent color.
                      </Text>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {Object.values(AccentColor).map(item => (
                        <button
                          key={item}
                          className={cn(
                            'focus-visible:rounded-full h-[26px] w-[26px] rounded-full',
                            accentColor === item && 'border border-cn-brand'
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
                  <Separator className="bg-cn-background-2 h-px" />
                  <div className="grid grid-cols-[246px_1fr] gap-x-8">
                    <div>
                      <Text variant="heading-base">Gray color</Text>
                      <Text className="mt-1.5" color="foreground-3">
                        Select your application gray color.
                      </Text>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {Object.values(GrayColor).map(item => (
                        <button
                          key={item}
                          className={cn(
                            'focus-visible:rounded-full h-[26px] w-[26px] rounded-full',
                            grayColor === item && 'border border-cn-2'
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
            </>
          )}
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  )
}

export { ThemeDialog }
