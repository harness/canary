export enum Language {
  English = 'English',
  Bulgarian = 'Bulgarian',
  Croatian = 'Croatian',
  Czech = 'Czech',
  French = 'French',
  German = 'German – Standard',
  Irish = 'Irish – Extended',
  Russian = 'Russian – QWERTY',
  LatinAmerican = 'Latin American'
}

export enum LanguageCode {
  EN = 'EN',
  БГ = 'БГ',
  HR = 'HR',
  CZ = 'CZ',
  FR = 'FR',
  DE = 'DE',
  IE = 'IE',
  RU = 'РУ',
  LA = 'LA'
}

export interface LanguageInterface {
  code: LanguageCode
  name: Language
}

export interface LanguageDialogProps {
  defaultLanguage?: LanguageCode
  language?: LanguageCode
  supportedLanguages: LanguageInterface[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onChange: (language: LanguageInterface) => void
  onSave: (language: LanguageInterface) => void
  onCancel: () => void
  children?: React.ReactNode
}
