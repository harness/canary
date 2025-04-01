import { FormEvent, MouseEvent, ReactNode, useState } from 'react'

import { Button, Dialog, Icon, SearchBox, Spacer, useSidebar } from '@/components'
import { cn } from '@/utils'
import { TFunction } from 'i18next'

interface ProjectProps {
  logo: ReactNode
  t: TFunction
}

function SidebarSearchLegacy({ logo, t }: ProjectProps) {
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
          variant="ghost"
          tabIndex={collapsed ? 0 : -1}
          className={cn(
            'absolute opacity-0 -z-10 left-0 top-0 px-2.5 py-2 text-sidebar-foreground-4 hover:text-sidebar-icon-1 bg-sidebar-background-1 hover:bg-sidebar-background-3 rounded border border-sidebar-border-2 pointer-events-none transition-[opacity,z-index] duration-75 delay-0 ease-linear group-data-[state=collapsed]:opacity-100 group-data-[state=collapsed]:pointer-events-auto group-data-[state=collapsed]:z-10 group-data-[state=collapsed]:delay-150'
          )}
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
