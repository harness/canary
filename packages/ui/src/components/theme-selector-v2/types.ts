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

export interface ThemeDialogProps {
  defaultTheme?: ThemeInterface
  theme?: ThemeInterface
  open: boolean
  onOpenChange: (open: boolean) => void
  onChange: (language: ThemeInterface) => void
  onSave: (language: ThemeInterface) => void
  onCancel: () => void
  children: React.ReactNode
}
