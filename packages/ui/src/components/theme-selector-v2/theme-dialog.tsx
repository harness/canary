import { FC, useEffect, useState } from 'react'

import { getModeColorContrastFromFullTheme, Icon, ModalDialog, Select, Separator } from '@/components'
import { ColorType, ContrastType, ModeType } from '@/context/theme'
import darkModeImage from '@/svgs/theme-dark.png'
import lightModeImage from '@/svgs/theme-light.png'
import { cn } from '@/utils/cn'

import { AccentColor, GrayColor, ThemeDialogProps } from './types'

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
    <ModalDialog.Root open={open} onOpenChange={onOpenChange}>
      {!!children && <ModalDialog.Trigger asChild>{children}</ModalDialog.Trigger>}
      <ModalDialog.Content size="md">
        <ModalDialog.Header>
          <ModalDialog.Title>Appearance settings</ModalDialog.Title>
        </ModalDialog.Header>
        <ModalDialog.Body>
          <div className="mt-1 flex flex-col gap-y-5">
            <div className="flex flex-col">
              <span className="text-3 font-medium text-cn-foreground-1">Mode</span>
              <p className="mt-1.5 text-2 leading-snug text-cn-foreground-3">
                Choose Dark mode for low light or Light mode for bright spaces.
              </p>
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
                            mode === value ? 'border-cn-borders-accent' : 'border-cn-borders-4'
                          )}
                        />
                        {mode === value && (
                          <Icon
                            className="absolute bottom-2 left-2 text-cn-foreground-1"
                            name="checkbox-circle"
                            size={16}
                          />
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
                      <span className="text-2 leading-tight text-cn-foreground-1">{key}</span>
                    </button>
                  )
                })}
              </div>
            </div>
            {isAccessibilityThemeEnabled && (
              <>
                <Separator className="h-px bg-cn-background-2" />

                {/* Contrast */}
                <div className="grid grid-cols-[246px_1fr] gap-x-8">
                  <div>
                    <span className="text-3 font-medium text-cn-foreground-1">Contrast</span>
                    <p className="mt-1.5 text-2 leading-snug text-cn-foreground-3">
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

                <Separator className="h-px bg-cn-background-2" />

                {/* Color Adjustment */}
                <div className="grid grid-cols-[246px_1fr] gap-x-8">
                  <div>
                    <span className="text-3 font-medium text-cn-foreground-1">Color adjustment</span>
                    <p className="mt-1.5 text-2 leading-snug text-cn-foreground-3">
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

                <Separator className="h-px bg-cn-background-2" />

                {/* Accent Color */}
                {showAccentColor ? (
                  <>
                    <Separator className="h-px bg-cn-background-2" />
                    <div className="grid grid-cols-[246px_1fr] gap-x-8">
                      <div>
                        <span className="text-3 font-medium text-cn-foreground-1">Accent color</span>
                        <p className="mt-1.5 text-2 leading-snug text-cn-foreground-3">
                          Select your application accent color.
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {Object.values(AccentColor).map(item => (
                          <button
                            key={item}
                            className={cn(
                              'focus-visible:rounded-full h-[26px] w-[26px] rounded-full',
                              accentColor === item && 'border border-cn-borders-8'
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
                    <Separator className="h-px bg-cn-background-2" />
                    <div className="grid grid-cols-[246px_1fr] gap-x-8">
                      <div>
                        <span className="text-3 font-medium text-cn-foreground-1">Gray color</span>
                        <p className="mt-1.5 text-2 leading-snug text-cn-foreground-3">
                          Select your application gray color.
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {Object.values(GrayColor).map(item => (
                          <button
                            key={item}
                            className={cn(
                              'focus-visible:rounded-full h-[26px] w-[26px] rounded-full',
                              grayColor === item && 'border border-cn-borders-8'
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
          </div>
        </ModalDialog.Body>
      </ModalDialog.Content>
    </ModalDialog.Root>
  )
}

export { ThemeDialog }
