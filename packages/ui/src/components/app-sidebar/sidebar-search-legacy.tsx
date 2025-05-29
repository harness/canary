import { FormEvent, MouseEvent, ReactNode, useState } from 'react'

import { Button, Dialog, Icon, SearchBox, Spacer, useSidebar } from '@/components'
import { useTranslation } from '@/context'
import { cn } from '@/utils'

interface ProjectProps {
  logo: ReactNode
}

function SidebarSearchLegacy({ logo }: ProjectProps) {
  const { t } = useTranslation()

  const [isSearchDialogOpen, setSearchDialogOpen] = useState(false)

  const { collapsed } = useSidebar()

  const openSearchDialog = (e?: FormEvent<HTMLInputElement> | MouseEvent<HTMLButtonElement>) => {
    e?.preventDefault()
    e?.stopPropagation()

    setSearchDialogOpen(true)
  }

  const closeSearchDialog = () => {
    setSearchDialogOpen(false)
  }

  return (
    <div className="flex w-full flex-col place-items-start">
      <div className="my-5 flex items-center pl-2">{logo}</div>
      <div className="relative w-full">
        <Button
          className="pointer-events-none absolute left-0 top-0 -z-10 opacity-0 transition-[opacity,z-index]  delay-0 duration-75 ease-linear group-data-[state=collapsed]:pointer-events-auto group-data-[state=collapsed]:z-10 group-data-[state=collapsed]:opacity-100 group-data-[state=collapsed]:delay-150"
          variant="ghost"
          iconOnly
          tabIndex={collapsed ? 0 : -1}
          onClick={openSearchDialog}
        >
          <Icon name="search" size={12} />
          <span className="sr-only">{t('component:navbar.searchButton', 'Open search dialog')}</span>
        </Button>

        <SearchBox.Root
          className={cn(
            'overflow-hidden opacity-100 transition-[width,opacity] duration-200 ease-linear group-data-[state=collapsed]:opacity-0 group-data-[state=collapsed]:w-8'
          )}
          width="full"
          placeholder={`${t('component:navbar.search', 'Search')}...`}
          hasShortcut
          shortcutLetter="K"
          shortcutModifier="cmd"
          value=""
          onSearch={openSearchDialog}
          handleChange={openSearchDialog}
          theme="sidebar"
          tabIndex={collapsed ? -1 : 0}
        />
      </div>
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
