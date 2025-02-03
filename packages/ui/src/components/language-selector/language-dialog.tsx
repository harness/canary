import { FC } from 'react'

import { Button, ButtonGroup, Dialog, Icon } from '@/components'

import { LanguageDialogProps, languages } from './types'

const LanguageDialog: FC<LanguageDialogProps> = ({
  defaultLanguage,
  language: specifiedLanguage,
  open,
  onOpenChange,
  onChange,
  onSave,
  onCancel,
  children
}) => {
  const language = specifiedLanguage || defaultLanguage

  const handleSave = (): void => {
    if (language) {
      const languageToSave = languages.find(lang => lang.code === language)
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
              onClick={() => onChange(lang)}
            >
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 flex justify-center items-center bg-background-12 rounded-sm">{lang.code}</div>
                <span>{lang.name}</span>
              </div>
              {language === lang.code && <Icon name="tick" size={16} />}
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
