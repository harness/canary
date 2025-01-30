import { useState } from 'react'

import { Button, ButtonGroup, Dialog } from '@/components'
import { CheckIcon } from '@radix-ui/react-icons'

enum Language {
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

interface LanguageInterface {
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
  onSave: (language: LanguageInterface) => void
}

const LanguageDialog: React.FC<LanguageDialogProps> = ({ onSave }) => {
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null)

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button variant="outline">Change Language</Button>
      </Dialog.Trigger>
      <Dialog.Content className="w-[400px]">
        <Dialog.Title>Language</Dialog.Title>
        <div className="space-y-2">
          {languages.map(lang => (
            <div
              key={lang.code}
              className={`flex justify-between items-center p-2 rounded-md cursor-pointer hover:bg-gray-700 ${selectedLanguage === lang.code ? 'bg-gray-600' : 'bg-gray-800'}`}
              onClick={() => {
                setSelectedLanguage(lang.code)
                onSave(lang)
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
              <Button variant="ghost">Cancel</Button>
              <Button variant="default">Save</Button>
            </>
          </ButtonGroup>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  )
}

export { LanguageDialog }
