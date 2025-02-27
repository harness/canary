export enum Language {
  English = 'English',
  French = 'French'
}

export enum LanguageCode {
  EN = 'en',
  FR = 'fr'
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
