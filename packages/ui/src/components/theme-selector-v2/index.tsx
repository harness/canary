import { useState } from 'react'

import { Button } from '@/components'
import { cn } from '@/utils/cn'
import * as Dialog from '@radix-ui/react-dialog'

const ThemeSelectorDialog = () => {
  const [theme, setTheme] = useState('dark')
  const [contrast, setContrast] = useState('default')
  const [colorAdjustment, setColorAdjustment] = useState('default')
  const [accentColor, setAccentColor] = useState('blue')

  const accentColors = ['yellow', 'red', 'pink', 'purple', 'blue', 'cyan', 'orange', 'brown', 'green']

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button variant="outline">Appearance Settings</Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        <Dialog.Content className="fixed top-1/2 left-1/2 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-black p-6 text-white shadow-lg">
          <Dialog.Title className="text-xl font-semibold mb-4">Appearance settings</Dialog.Title>

          {/* Mode Selection */}
          <div className="mb-4">
            <p className="text-sm text-gray-400">Select or customize your UI theme.</p>
            <div className="flex gap-4 mt-2">
              <button
                className={cn(
                  'w-full h-16 border rounded-lg flex items-center justify-center',
                  theme === 'dark' ? 'border-white' : 'border-gray-600'
                )}
                onClick={() => setTheme('dark')}
              >
                Dark
              </button>
              <button
                className={cn(
                  'w-full h-16 border rounded-lg flex items-center justify-center',
                  theme === 'light' ? 'border-white' : 'border-gray-600'
                )}
                onClick={() => setTheme('light')}
              >
                Light
              </button>
            </div>
          </div>

          {/* Contrast Selection */}
          <div className="mb-4">
            <p className="text-sm text-gray-400">High contrast improves readability, Dimmer mode reduces glare.</p>
            <div className="flex flex-col mt-2 gap-2">
              {['default', 'high-contrast', 'dimmer'].map(c => (
                <label key={c} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="contrast"
                    value={c}
                    checked={contrast === c}
                    onChange={() => setContrast(c)}
                    className="accent-white"
                  />
                  {c === 'default' ? 'Default' : c === 'high-contrast' ? 'High contrast' : 'Dimmer'}
                </label>
              ))}
            </div>
          </div>

          {/* Color Adjustment */}
          <div className="mb-4">
            <p className="text-sm text-gray-400">Adjust colors for different types of color blindness.</p>
            <div className="flex flex-col mt-2 gap-2">
              {['default', 'protanopia', 'deuteranopia', 'tritanopia'].map(c => (
                <label key={c} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="color-adjustment"
                    value={c}
                    checked={colorAdjustment === c}
                    onChange={() => setColorAdjustment(c)}
                    className="accent-white"
                  />
                  {c.charAt(0).toUpperCase() + c.slice(1)}
                </label>
              ))}
            </div>
          </div>

          {/* Accent Color Selection */}
          <div className="mb-4">
            <p className="text-sm text-gray-400">Select your application accent color.</p>
            <div className="flex gap-2 mt-2">
              {accentColors.map(color => (
                <button
                  key={color}
                  className={cn(
                    'w-8 h-8 rounded-full border-2',
                    accentColor === color ? 'border-white' : 'border-transparent'
                  )}
                  style={{ backgroundColor: color }}
                  onClick={() => setAccentColor(color)}
                />
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2 mt-4">
            <Dialog.Close asChild>
              <Button variant="outline">Cancel</Button>
            </Dialog.Close>
            <Button onClick={() => console.log({ theme, contrast, colorAdjustment, accentColor })}>
              Save preferences
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export { ThemeSelectorDialog }
