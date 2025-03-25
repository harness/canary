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
    <div className="flex w-full flex-col place-items-start pb-3 pt-1.5">
      <div className="mb-5 mt-3.5 flex max-w-full items-center overflow-hidden pl-2">{logo}</div>
      <div className="relative w-full">
        <Button
          variant="ghost"
          tabIndex={collapsed ? 0 : -1}
          aria-label="Open search dialog"
          className={cn(
            'absolute opacity-0 -z-10 left-0 top-0 px-2.5 py-[9px] bg-sidebar-background-1 pointer-events-none transition-[opacity] duration-150 ease-linear',
            { 'z-10 opacity-100 pointer-events-auto': collapsed }
          )}
          onClick={openSearchDialog}
        >
          <Icon className="text-sidebar-foreground-4" name="search" size={12} />
        </Button>

        <SearchBox.Root
          className={cn('overflow-hidden opacity-100 transition-[width,opacity] duration-150 ease-linear', {
            'w-8 opacity-0': collapsed
          })}
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
