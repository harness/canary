import { useEffect, useState } from 'react'

import { Button, ButtonGroup, Dialog } from '@/components'
import { CheckIcon } from '@radix-ui/react-icons'

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
  PY = 'PY',
  LA = 'LA'
}

export interface LanguageInterface {
  code: LanguageCode
  name: Language
}

const languages: LanguageInterface[] = [
  { code: LanguageCode.EN, name: Language.English },
  { code: LanguageCode.БГ, name: Language.Bulgarian },
  { code: LanguageCode.HR, name: Language.Croatian },
  { code: LanguageCode.CZ, name: Language.Czech },
  { code: LanguageCode.FR, name: Language.French },
  { code: LanguageCode.DE, name: Language.German },
  { code: LanguageCode.IE, name: Language.Irish },
  { code: LanguageCode.PY, name: Language.Russian },
  { code: LanguageCode.LA, name: Language.LatinAmerican }
]

interface LanguageDialogProps {
  defaultLanguage?: LanguageCode
  language?: LanguageCode
  open: boolean
  onOpenChange: (open: boolean) => void
  onChange: (language: LanguageInterface) => void
  onSave: (language: LanguageInterface) => void
  onCancel: () => void
  children: React.ReactNode
}

const LanguageDialog: React.FC<LanguageDialogProps> = ({
  defaultLanguage,
  language,
  open,
  onOpenChange,
  onChange,
  onSave,
  onCancel,
  children
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode | null>(null)

  useEffect(() => {
    if (language) {
      setSelectedLanguage(language)
    } else if (defaultLanguage) {
      setSelectedLanguage(defaultLanguage)
    }
  }, [defaultLanguage, language])

  const handleSave = () => {
    if (selectedLanguage) {
      const languageToSave = languages.find(lang => lang.code === selectedLanguage)
      if (languageToSave) {
        onSave(languageToSave)
      }
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Content className="w-[400px]">
        <Dialog.Title>Language</Dialog.Title>
        {languages.map(lang => (
          <Button
            variant="ghost"
            key={lang.code}
            className="flex justify-between items-center p-2 rounded-md cursor-pointer hover:bg-gray-700"
            onClick={() => {
              setSelectedLanguage(lang.code)
              onChange(lang)
            }}
          >
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 flex justify-center items-center bg-background-12 rounded-sm">{lang.code}</div>
              <span>{lang.name}</span>
            </div>
            {selectedLanguage === lang.code && <CheckIcon width={20} height={20} />}
          </Button>
        ))}

        {/* Buttons */}
        <Dialog.Footer>
          <ButtonGroup>
            <>
              <Button variant="ghost" onClick={onCancel}>
                Cancel
              </Button>
              <Button variant="default" onClick={handleSave}>
                Save
              </Button>
            </>
          </ButtonGroup>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  )
}

export { LanguageDialog }
