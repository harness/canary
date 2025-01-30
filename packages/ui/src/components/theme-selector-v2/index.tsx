import { useState } from 'react'

import { Button, ButtonGroup, Dialog, Separator } from '@/components'
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
  onSave: (theme: ThemeInterface) => void
}

const ThemeDialog: React.FC<ThemeDialogProps> = ({ onSave }) => {
  const [mode, setMode] = useState<Mode>(Mode.Dark)
  const [contrast, setContrast] = useState<Contrast>(Contrast.Default)
  const [colorAdjustment, setColorAdjustment] = useState<ColorAdjustment>(ColorAdjustment.Default)
  const [accentColor, setAccentColor] = useState<AccentColor>(AccentColor.Blue)

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button variant="outline">Appearance Settings</Button>
      </Dialog.Trigger>
      <Dialog.Content className="w-[450px]">
        <Dialog.Title>Appearance Settings</Dialog.Title>
        {/* Mode */}
        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-300">Mode</h3>
          <h4 className="text-xs text-gray-100">Select or customize your UI theme.</h4>
          <div className="mt-2 flex gap-4">
            {Object.values(Mode).map(m => (
              <label key={m} className="flex cursor-pointer items-center gap-2">
                <input
                  type="radio"
                  name="theme"
                  value={mode}
                  checked={mode === m}
                  onChange={() => setMode(m)}
                  className="hidden"
                />
                <div className={cn('h-16 w-24 rounded border p-2', mode === m ? 'border-white' : 'border-gray-600')} />
                <span className="text-gray-300">{mode}</span>
              </label>
            ))}
          </div>
        </div>

        <Separator className="h-px bg-gray-600" />

        {/* Contrast */}
        <div>
          <h3 className="text-sm font-medium text-gray-300">Contrast</h3>
          <h4 className="text-xs text-gray-100">High contrast improves readability, Dimmer mode reduces glare.</h4>
          <div className="mt-2 flex gap-2">
            {Object.values(Contrast).map(c => (
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
                <span className="text-gray-300">{c}</span>
              </label>
            ))}
          </div>
        </div>

        <Separator className="h-px bg-gray-600" />

        {/* Color Adjustment */}
        <div>
          <h3 className="text-sm font-medium text-gray-300">Color Adjustment</h3>
          <h4 className="text-xs text-gray-100">Adjust colors for different types of color blindness.</h4>
          <div className="mt-2 flex gap-2">
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
                <span className="text-gray-300">{ca}</span>
              </label>
            ))}
          </div>
        </div>

        <Separator className="h-px bg-gray-600" />

        {/* Accent Color */}
        <div>
          <h3 className="text-sm font-medium text-gray-300">Accent Color</h3>
          <h4 className="text-xs text-gray-100">Select your application accent color.</h4>
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
        <Dialog.Footer>
          <ButtonGroup>
            <>
              <Button variant="secondary">Cancel</Button>
              <Button onClick={() => onSave({ mode, contrast, colorAdjustment, accentColor })}>Save preferences</Button>
            </>
          </ButtonGroup>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  )
}

export { ThemeDialog }
