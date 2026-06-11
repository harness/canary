import { FC, useState } from 'react'

import {
  Dialog,
  getModeColorContrastFromFullTheme,
  IconV2,
  Select,
  SelectValueOption,
  Separator,
  Text
} from '@/components'
import { ColorType, ContrastType, ModeType, ThemeSelectionOptions } from '@/context/theme'
import darkModeImage from '@/svgs/theme-dark.png'
import lightModeImage from '@/svgs/theme-light.png'
import { cn } from '@/utils/cn'

import { AccentColor, GrayColor, ThemeDialogProps } from './types'

const contrastOptions: SelectValueOption<ContrastType>[] = Object.entries(ContrastType).map(([key, value]) => ({
  label: key,
  value
}))

const colorLabels: Record<ColorType, string> = {
  [ColorType.Standard]: 'Standard',
  [ColorType.Protanopia]: 'Protanopia (red-blind)',
  [ColorType.Deuteranopia]: 'Deuteranopia (green-blind)',
  [ColorType.Tritanopia]: 'Tritanopia (blue-blind)'
}

const colorOptions: SelectValueOption<ColorType>[] = Object.values(ColorType).map(value => ({
  label: colorLabels[value],
  value
}))

const ThemeDialog: FC<ThemeDialogProps> = ({
  theme,
  setTheme,
  isSystemTheme: isSystemThemeSelected,
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

  const { mode, color: colorAdjustment, contrast } = getModeColorContrastFromFullTheme(theme)

  /**
   * Hiding accessibility theme options till we
   * complete the new design system migration.
   */
  const isAccessibilityThemeEnabled = showAccessibilityThemeOptions

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      {!!children && <Dialog.Trigger>{children}</Dialog.Trigger>}
      <Dialog.Content size="md">
        <Dialog.Header>
          <Dialog.Title>Appearance settings</Dialog.Title>
        </Dialog.Header>
        <Dialog.Body>
          <div className="flex flex-col">
            <Text variant="heading-base">Mode</Text>
            <Text className="mt-cn-2xs" color="foreground-3">
              Choose Dark mode for low light or Light mode for bright spaces. System follows your device settings.
            </Text>
            <div className={cn('mt-cn-md gap-cn-md grid', showSystemMode ? 'grid-cols-3' : 'grid-cols-2')}>
              {Object.entries(ThemeSelectionOptions).map(([key, value]) => {
                if (!showSystemMode && value === ThemeSelectionOptions.System) return null
                const isSystemOption = value === ThemeSelectionOptions.System
                return (
                  <button
                    className="flex flex-col gap-y-cn-xs focus-visible:outline-none"
                    key={key}
                    onClick={() => {
                      if (isSystemOption) {
                        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
                        const resolvedMode = prefersDark ? ModeType.Dark : ModeType.Light
                        setTheme({ newTheme: `${resolvedMode}-${colorAdjustment}-${contrast}`, isSystemTheme: true })
                      } else {
                        setTheme({ newTheme: `${value}-${colorAdjustment}-${contrast}`, isSystemTheme: false })
                      }
                    }}
                  >
                    <div className="relative">
                      {isSystemOption ? (
                        <div
                          className={cn(
                            'relative w-full overflow-hidden rounded-cn-3 border',
                            isSystemThemeSelected ? 'border-cn-brand' : 'border-cn-3'
                          )}
                        >
                          <img src={lightModeImage} alt="" className="block h-auto w-full" />
                          <img
                            src={darkModeImage}
                            alt=""
                            className="absolute inset-0 h-auto w-full"
                            style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%)' }}
                          />
                        </div>
                      ) : (
                        <img
                          src={value === ThemeSelectionOptions.Dark ? darkModeImage : lightModeImage}
                          alt=""
                          className={cn(
                            'w-full h-auto rounded-cn-3 border',
                            !isSystemThemeSelected && mode === value.toLowerCase() ? 'border-cn-brand' : 'border-cn-3'
                          )}
                        />
                      )}
                      {(isSystemOption ? isSystemThemeSelected : !isSystemThemeSelected && mode === value.toLowerCase()) && (
                        <IconV2 color={isSystemThemeSelected ? 'neutral' : 'inherit'} className="absolute bottom-cn-xs left-cn-xs" name="check-circle-solid" />
                      )}
                      {!isSystemOption && (
                        <div
                          className="absolute right-[27px] top-[61px] h-2 w-9 rounded-cn-1"
                          style={{
                            backgroundColor:
                              accentColor === AccentColor.White
                                ? value === ThemeSelectionOptions.Light
                                  ? 'hsla(240, 6%, 40%, 1)'
                                  : 'hsla(240, 9%, 67%, 1)'
                                : accentColor
                          }}
                          aria-hidden
                        />
                      )}
                    </div>
                    <Text as="span" color="foreground-1">
                      {key}
                    </Text>
                  </button>
                )
              })}
            </div>
          </div>
          {isAccessibilityThemeEnabled && (
            <>
              <Separator className="h-px bg-cn-2" />

              {/* Contrast */}
              <div className="grid grid-cols-[246px_1fr] gap-x-cn-2xl">
                <div>
                  <Text variant="heading-base">Contrast</Text>
                  <Text className="mt-cn-2xs" color="foreground-3">
                    High contrast improves readability, Low contrast reduces glare.
                  </Text>
                </div>

                <Select
                  value={contrast}
                  options={contrastOptions}
                  onChange={(value: ContrastType) => setTheme({ newTheme: `${mode}-${colorAdjustment}-${value}`, isSystemTheme: false })}
                  placeholder="Select"
                />
              </div>

              <Separator className="h-px bg-cn-2" />

              {/* Color Adjustment */}
              <div className="grid grid-cols-[246px_1fr] gap-x-cn-2xl">
                <div>
                  <Text variant="heading-base">Color adjustment</Text>
                  <Text className="mt-cn-2xs" color="foreground-3">
                    Adjust colors for different types of color vision deficiency.
                  </Text>
                </div>

                <Select
                  value={colorAdjustment}
                  options={colorOptions}
                  onChange={(value: ColorType) => setTheme({ newTheme: `${mode}-${value}-${contrast}`, isSystemTheme: false })}
                  placeholder="Select"
                />
              </div>

              <Separator className="h-px bg-cn-2" />

              {/* Accent Color */}
              {showAccentColor ? (
                <>
                  <Separator className="h-px bg-cn-2" />
                  <div className="grid grid-cols-[246px_1fr] gap-x-cn-2xl">
                    <div>
                      <Text variant="heading-base">Accent color</Text>
                      <Text className="mt-cn-2xs" color="foreground-3">
                        Select your application accent color.
                      </Text>
                    </div>
                    <div className="flex flex-wrap gap-cn-2xs">
                      {Object.values(AccentColor).map(item => (
                        <button
                          key={item}
                          className={cn(
                            'focus-visible:rounded-cn-full h-[26px] w-[26px] rounded-cn-full',
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
                            className="m-auto block size-[18px] rounded-cn-full"
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
                  <Separator className="h-px bg-cn-2" />
                  <div className="grid grid-cols-[246px_1fr] gap-x-cn-2xl">
                    <div>
                      <Text variant="heading-base">Gray color</Text>
                      <Text className="mt-cn-2xs" color="foreground-3">
                        Select your application gray color.
                      </Text>
                    </div>
                    <div className="flex flex-wrap gap-cn-2xs">
                      {Object.values(GrayColor).map(item => (
                        <button
                          key={item}
                          className={cn(
                            'focus-visible:rounded-cn-full h-[26px] w-[26px] rounded-cn-full',
                            grayColor === item && 'border border-cn-2'
                          )}
                          onClick={() => {
                            setGrayColor(item)
                          }}
                        >
                          <span
                            style={{ backgroundColor: item }}
                            className="m-auto block size-[18px] rounded-cn-full"
                          />
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
