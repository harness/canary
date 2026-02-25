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

import { ThemeDialogProps } from './types'

const contrastOptions: SelectValueOption<ContrastType>[] = [
  { label: 'Standard', value: ContrastType.Standard },
  { label: 'Low contrast', value: ContrastType.Low },
  { label: 'High contrast', value: ContrastType.High }
]

const colorOptions: SelectValueOption<ColorType>[] = [
  { label: 'Standard', value: ColorType.Standard },
  { label: 'Tritanopia (Blue-Yellow)', value: ColorType.Tritanopia },
  { label: 'Protanopia (Red-Green)', value: ColorType.Protanopia },
  { label: 'Deuteranopia (Red-Green)', value: ColorType.Deuteranopia }
]

const ThemeDialog: FC<ThemeDialogProps> = ({
  theme,
  setTheme,
  open,
  onOpenChange,
  children,
  showSystemMode,
  showAccessibilityThemeOptions = false
}) => {

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
      {!!children && <Dialog.Trigger>{children}</Dialog.Trigger>}
      <Dialog.Content size="md">
        <Dialog.Header>
          <Dialog.Title>Appearance settings</Dialog.Title>
        </Dialog.Header>
        <Dialog.Body>
          <div className="gap-cn-md grid grid-cols-2">
            {Object.entries(ModeType).map(([key, value]) => {
              if (!showSystemMode && value === ModeType.System) return null
              const valueMode = value === ModeType.System ? systemMode : value
              // TODO: Design system: Update buttons here.
              return (
                <button
                  className="gap-y-cn-xs flex flex-col focus-visible:outline-none"
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
                        'w-full h-auto rounded-cn-5 border',
                        mode === value ? 'border-cn-brand' : 'border-cn-3'
                      )}
                    />
                    {mode === value && (
                      <IconV2 className="text-cn-1 bottom-cn-xs left-cn-xs absolute" name="check-circle-solid" />
                    )}
                  </div>
                  <Text as="span" color="foreground-1">
                    {key}
                  </Text>
                </button>
              )
            })}
          </div>
          {isAccessibilityThemeEnabled && (
            <>
              <Separator className="bg-cn-2 h-px" />

              {/* Contrast */}
              <div className="gap-x-cn-2xl grid grid-cols-[246px_1fr]">
                <div>
                  <Text variant="heading-base">Contrast</Text>
                  <Text className="mt-cn-2xs" color="foreground-3">
                    High contrast improves readability, Low contrast reduces glare.
                  </Text>
                </div>
                <Select
                  value={contrast}
                  options={contrastOptions}
                  onChange={(value: ContrastType) => setTheme(`${mode}-${colorAdjustment}-${value}`)}
                  placeholder="Select"
                />
              </div>

              <Separator className="bg-cn-2 h-px" />

              {/* Color Adjustment */}
              <div className="gap-x-cn-2xl grid grid-cols-[246px_1fr]">
                <div>
                  <Text variant="heading-base">Color adjustment</Text>
                  <Text className="mt-cn-2xs" color="foreground-3">
                    Adjust colors for different types of color vision deficiency.
                  </Text>
                </div>
                <Select
                  value={colorAdjustment}
                  options={colorOptions}
                  onChange={(value: ColorType) => setTheme(`${mode}-${value}-${contrast}`)}
                  placeholder="Select"
                />
              </div>
            </>
          )}
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  )
}

export { ThemeDialog }
