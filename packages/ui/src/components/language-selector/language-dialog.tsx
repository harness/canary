import React, { FC, useEffect, useState } from 'react'

import { Button, ButtonGroup, Dialog, Icon } from '@/components'

import { LanguageCode, LanguageDialogProps, languages } from './types'

const LanguageDialog: FC<LanguageDialogProps> = ({
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

  const handleSave = (): void => {
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
        <div className="flex flex-col gap-3">
          {languages.map(lang => (
            <Button
              variant="ghost"
              key={lang.code}
              className="flex justify-between items-center py-2 px-1 rounded-md cursor-pointer hover:bg-gray-400"
              onClick={() => {
                setSelectedLanguage(lang.code)
                onChange(lang)
              }}
            >
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 flex justify-center items-center bg-background-12 rounded-sm">{lang.code}</div>
                <span>{lang.name}</span>
              </div>
              {selectedLanguage === lang.code && <Icon name="tick" size={16} />}
            </Button>
          ))}
        </div>

        {/* Buttons */}
        <Dialog.Footer>
          <ButtonGroup>
            <Button variant="ghost" onClick={onCancel}>
              Cancel
            </Button>
            <Button variant="default" onClick={handleSave}>
              Save
            </Button>
          </ButtonGroup>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  )
}

export { LanguageDialog }
