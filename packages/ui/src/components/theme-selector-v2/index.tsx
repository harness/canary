import { useState } from 'react'

import { Button, Separator } from '@/components'
import { cn } from '@/utils/cn'
import * as Dialog from '@radix-ui/react-dialog'

export enum ThemeMode {
  Dark = 'dark',
  Light = 'light'
}

export enum ContrastMode {
  Default = 'default',
  HighContrast = 'high-contrast',
  Dimmer = 'dimmer'
}

export enum ColorAdjustment {
  Default = 'default',
  Protanopia = 'protanopia',
  Deuteranopia = 'deuteranopia',
  Tritanopia = 'tritanopia'
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

const ThemeDialog = () => {
  const [theme, setTheme] = useState<ThemeMode>(ThemeMode.Dark)
  const [contrast, setContrast] = useState<ContrastMode>(ContrastMode.Default)
  const [colorAdjustment, setColorAdjustment] = useState<ColorAdjustment>(ColorAdjustment.Default)
  const [accentColor, setAccentColor] = useState<AccentColor>(AccentColor.Blue)

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button variant="outline">Appearance Settings</Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-black p-6 shadow-lg">
          <Dialog.Title className="text-lg font-semibold text-white">Appearance Settings</Dialog.Title>
          <Dialog.Close asChild>
            <Button variant="ghost" size="icon" className="absolute right-3 top-3">
              ✕
            </Button>
          </Dialog.Close>

          {/* Mode */}
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-300">Mode</h3>
            <div className="mt-2 flex gap-4">
              {Object.values(ThemeMode).map(mode => (
                <label key={mode} className="flex cursor-pointer items-center gap-2">
                  <input
                    type="radio"
                    name="theme"
                    value={mode}
                    checked={theme === mode}
                    onChange={() => setTheme(mode)}
                    className="hidden"
                  />
                  <div
                    className={cn('h-16 w-24 rounded border p-2', theme === mode ? 'border-white' : 'border-gray-600')}
                  />
                  <span className="text-gray-300">{mode.charAt(0).toUpperCase() + mode.slice(1)}</span>
                </label>
              ))}
            </div>
          </div>

          <Separator className="my-4 h-px bg-gray-600" />

          {/* Contrast */}
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-300">Contrast</h3>
            <div className="mt-2 flex flex-col gap-2">
              {Object.values(ContrastMode).map(c => (
                <label key={c} className="flex cursor-pointer items-center gap-2">
                  <input
                    type="radio"
                    name="contrast"
                    value={c}
                    checked={contrast === c}
                    onChange={() => setContrast(c)}
                    className="hidden"
                  />
                  <div className="h-4 w-4 rounded-full border border-gray-600 flex items-center justify-center">
                    {contrast === c && <div className="h-2 w-2 rounded-full bg-white" />}
                  </div>
                  <span className="text-gray-300">{c.replace('-', ' ')}</span>
                </label>
              ))}
            </div>
          </div>

          <Separator className="my-4 h-px bg-gray-600" />

          {/* Color Adjustment */}
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-300">Color Adjustment</h3>
            <div className="mt-2 flex flex-col gap-2">
              {Object.values(ColorAdjustment).map(ca => (
                <label key={ca} className="flex cursor-pointer items-center gap-2">
                  <input
                    type="radio"
                    name="color-adjustment"
                    value={ca}
                    checked={colorAdjustment === ca}
                    onChange={() => setColorAdjustment(ca)}
                    className="hidden"
                  />
                  <div className="h-4 w-4 rounded-full border border-gray-600 flex items-center justify-center">
                    {colorAdjustment === ca && <div className="h-2 w-2 rounded-full bg-white" />}
                  </div>
                  <span className="text-gray-300">{ca.charAt(0).toUpperCase() + ca.slice(1)}</span>
                </label>
              ))}
            </div>
          </div>

          <Separator className="my-4 h-px bg-gray-600" />

          {/* Accent Color */}
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-300">Accent Color</h3>
            <div className="mt-2 flex gap-2">
              {Object.values(AccentColor).map(color => (
                <button
                  key={color}
                  className={cn(
                    'h-6 w-6 rounded-full border',
                    accentColor === color ? 'border-white' : 'border-gray-600'
                  )}
                  style={{ backgroundColor: color }}
                  onClick={() => setAccentColor(color)}
                />
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-6 flex justify-end gap-2">
            <Dialog.Close asChild>
              <Button variant="secondary">Cancel</Button>
            </Dialog.Close>
            <Dialog.Close asChild>
              <Button onClick={() => console.log({ theme, contrast, colorAdjustment, accentColor })}>
                Save preferences
              </Button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export { ThemeDialog }
