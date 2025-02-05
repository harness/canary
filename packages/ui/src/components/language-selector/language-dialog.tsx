import { FC, useEffect, useState } from 'react'

import { Dialog, Icon } from '@/components'
import { cn } from '@utils/cn'

import { LanguageCode, LanguageDialogProps, languages } from './types'

const LanguageDialog: FC<LanguageDialogProps> = ({
  defaultLanguage = LanguageCode.EN,
  language,
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
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      {!!children && <Dialog.Trigger asChild>{children}</Dialog.Trigger>}
      <Dialog.Content className="max-w-[400px]">
        <Dialog.Title className="text-20 font-medium">Language</Dialog.Title>
        <div className="flex flex-col gap-3">
          {languages.map(lang => (
            <button
              key={lang.code}
              className="group relative flex cursor-pointer items-center justify-between rounded-md px-0 focus-visible:outline-none"
              onClick={() => {
                setSelectedLanguage(lang.code)
                onChange(lang)
              }}
            >
              <div className="flex items-center gap-2">
                <div className="bg-background-12 text-12 text-foreground-3 flex size-6 items-center justify-center rounded-sm">
                  {lang.code}
                </div>
                <span className="text-foreground-1">{lang.name}</span>
              </div>
              {selectedLanguage === lang.code && <Icon className="text-icons-2 " name="tick" size={12} />}
              <span
                className={cn(
                  'absolute -inset-x-2 -inset-y-1 rounded group-hover:bg-background-4 group-focus-visible:outline group-focus-visible:outline-offset-2 group-focus-visible:outline-borders-accent group-focus-visible:outline-2',
                  selectedLanguage === lang.code && 'bg-background-4'
                )}
                aria-hidden
              />
            </button>
          ))}
        </div>
      </Dialog.Content>
    </Dialog.Root>
  )
}

export { LanguageDialog }
