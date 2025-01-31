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

export interface LanguageInterface {
  code: string
  name: Language
}

const languages: LanguageInterface[] = [
  { code: 'EN', name: Language.English },
  { code: 'БГ', name: Language.Bulgarian },
  { code: 'HR', name: Language.Croatian },
  { code: 'CZ', name: Language.Czech },
  { code: 'FR', name: Language.French },
  { code: 'DE', name: Language.German },
  { code: 'IE', name: Language.Irish },
  { code: 'PY', name: Language.Russian },
  { code: 'LA', name: Language.LatinAmerican }
]

interface LanguageDialogProps {
  defaultLanguage?: LanguageInterface
  language?: LanguageInterface
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
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null)

  useEffect(() => {
    if (language) {
      setSelectedLanguage(language.code)
    } else if (defaultLanguage) {
      setSelectedLanguage(defaultLanguage.code)
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
        <div className="space-y-2">
          {languages.map(lang => (
            <div
              key={lang.code}
              className={`flex justify-between items-center p-2 rounded-md cursor-pointer hover:bg-gray-700 ${selectedLanguage === lang.code ? 'bg-gray-600' : 'bg-gray-800'}`}
              onClick={() => {
                setSelectedLanguage(lang.code)
                onChange(lang)
              }}
            >
              <span>
                {lang.code} - {lang.name}
              </span>
              {selectedLanguage === lang.code && <CheckIcon />}
            </div>
          ))}
        </div>

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
