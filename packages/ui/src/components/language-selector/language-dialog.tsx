import { FC, useEffect, useState } from 'react'

import { Avatar } from '@components/avatar'

import { CardSelect } from '../card-select'
import { ModalDialog } from '../modal-dialog'
import { Language, LanguageCode, LanguageDialogProps, LanguageInterface } from './types'

export const languages: LanguageInterface[] = [
  { code: LanguageCode.EN, name: Language.English },
  { code: LanguageCode.FR, name: Language.French }
]

const LanguageDialog: FC<LanguageDialogProps> = ({
  defaultLanguage = LanguageCode.EN,
  language,
  supportedLanguages,
  open,
  onOpenChange,
  onChange,
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

  return (
    <ModalDialog.Root open={open} onOpenChange={onOpenChange}>
      {!!children && <ModalDialog.Trigger asChild>{children}</ModalDialog.Trigger>}
      <ModalDialog.Content>
        <ModalDialog.Header>
          <ModalDialog.Title className="text-5 font-medium">Language</ModalDialog.Title>
        </ModalDialog.Header>
        <ModalDialog.Body>
          <CardSelect.Root
            type="single"
            value={selectedLanguage}
            onValueChange={(val: unknown) => {
              const code = val as LanguageCode
              const lang = supportedLanguages.find(l => l.code === code)
              if (lang) {
                setSelectedLanguage(lang.code)
                onChange(lang)
              }
            }}
          >
            {supportedLanguages.map(lang => (
              <CardSelect.Item key={lang.code} value={lang.code}>
                <div className="flex items-center gap-2">
                  <Avatar name={lang.code.split('').join(' ')} />
                  <CardSelect.Title>{lang.name}</CardSelect.Title>
                </div>
              </CardSelect.Item>
            ))}
          </CardSelect.Root>
        </ModalDialog.Body>
      </ModalDialog.Content>
    </ModalDialog.Root>
  )
}

export { LanguageDialog }
