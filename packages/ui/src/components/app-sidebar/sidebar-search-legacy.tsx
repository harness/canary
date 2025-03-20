import { FormEvent, ReactNode, useState } from 'react'

import { TFunction } from 'i18next'

import { Dialog, SearchBox, Spacer } from '..'

interface ProjectProps {
  logo: ReactNode
  t: TFunction
}

function SidebarSearchLegacy({ logo, t }: ProjectProps) {
  const [isSearchDialogOpen, setSearchDialogOpen] = useState(false)

  const openSearchDialog = (e?: FormEvent<HTMLInputElement>) => {
    e?.preventDefault()
    e?.stopPropagation()

    setSearchDialogOpen(true)
  }

  const closeSearchDialog = () => {
    setSearchDialogOpen(false)
  }

  return (
    <div className="flex w-full flex-col place-items-start pb-3 pt-1.5">
      <div className="mb-5 mt-3.5 flex items-center pl-2">{logo}</div>
      <SearchBox.Root
        width="full"
        placeholder={`${t('component:navbar.search', 'Search')}...`}
        hasShortcut
        shortcutLetter="K"
        shortcutModifier="cmd"
        value=""
        onSearch={openSearchDialog}
        handleChange={openSearchDialog}
        theme="sidebar"
      />
      <Dialog.Root open={isSearchDialogOpen} onOpenChange={closeSearchDialog}>
        <Dialog.Content className="h-[600px] max-w-[800px]">
          <Dialog.Header>
            <Dialog.Title>{t('component:navbar.search', 'Search')}</Dialog.Title>
            <Dialog.Description>
              <Spacer size={6} />
              <SearchBox.Root width="full" placeholder={`${t('component:navbar.search', 'Search')}...`} />
            </Dialog.Description>
          </Dialog.Header>
        </Dialog.Content>
      </Dialog.Root>
    </div>
  )
}

export { SidebarSearchLegacy }
