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

export const languages: LanguageInterface[] = [
  { code: LanguageCode.EN, name: Language.English },
  { code: LanguageCode.БГ, name: Language.Bulgarian },
  { code: LanguageCode.HR, name: Language.Croatian },
  { code: LanguageCode.CZ, name: Language.Czech },
  { code: LanguageCode.FR, name: Language.French },
  { code: LanguageCode.DE, name: Language.German },
  { code: LanguageCode.IE, name: Language.Irish },
  { code: LanguageCode.RU, name: Language.Russian },
  { code: LanguageCode.LA, name: Language.LatinAmerican }
]

export interface LanguageDialogProps {
  defaultLanguage?: LanguageCode
  language?: LanguageCode
  open: boolean
  onOpenChange: (open: boolean) => void
  onChange: (language: LanguageInterface) => void
  onSave: (language: LanguageInterface) => void
  onCancel: () => void
  children?: React.ReactNode
}
