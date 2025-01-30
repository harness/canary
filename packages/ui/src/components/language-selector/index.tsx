import { useState } from 'react'

import { Button } from '@/components'
import * as Dialog from '@radix-ui/react-dialog'
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
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 w-[320px] -translate-x-1/2 -translate-y-1/2 bg-black text-white rounded-xl p-4 shadow-lg">
          <Dialog.Title className="text-lg font-semibold">Language</Dialog.Title>
          <Dialog.Close asChild>
            <Button variant="ghost" size="icon" className="absolute right-3 top-3">
              ✕
            </Button>
          </Dialog.Close>
          <div className="mt-4 space-y-2">
            {languages.map(lang => (
              <div
                key={lang.code}
                className={`flex justify-between items-center p-2 rounded-md cursor-pointer hover:bg-gray-700 ${selectedLanguage === lang.code ? 'bg-gray-600' : 'bg-gray-800'}`}
                onClick={() => {
                  setSelectedLanguage(lang.code)
                  onSave(lang)
                }}
              >
                <span>{lang.name}</span>
                {selectedLanguage === lang.code && <CheckIcon />}
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Dialog.Close asChild>
              <Button variant="ghost">Cancel</Button>
            </Dialog.Close>
            <Dialog.Close asChild>
              <Button variant="default">Save</Button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export { LanguageDialog }
