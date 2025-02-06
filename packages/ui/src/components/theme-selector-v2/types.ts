export interface ThemeInterface {
  mode: Mode
  contrast: Contrast
  colorAdjustment: ColorAdjustment
  accentColor: AccentColor
  grayColor: GrayColor
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
  Red = '#FF4D4D',
  Green = '#63E979',
  Yellow = '#FFC44D',
  Cyan = '#4DA6FF',
  Pink = '#FF66E5',
  Purple = '#B266FF',
  Violet = '#9580FF',
  Blue = '#4D6AFF',
  Turquoise = '#33DDFF',
  Orange = '#FF884D',
  Brown = '#A68059',
  LightGreen = '#4DFFB5',
  Lime = '#A6FF4D',
  White = '#FFFFFF'
}

export enum GrayColor {
  First = '#6B6E74',
  Second = '#6E6E6E',
  Third = '#6F6D76',
  Fourth = '#6B6E75',
  Fifth = '#66716B',
  Sixth = '#6B7068',
  Seventh = '#6F6D68'
}

export interface ThemeDialogProps {
  defaultTheme?: ThemeInterface
  theme?: ThemeInterface
  open: boolean
  onOpenChange: (open: boolean) => void
  onChange: (language: ThemeInterface) => void
  children?: React.ReactNode
}
