import { FormHTMLAttributes, ReactNode } from 'react'

import { Button, Input, Label } from '@/components'
import { Icon } from '@components/icon'
import { Sidebar } from '@components/sidebar/sidebar'
import { TFunction } from 'i18next'

import { useSearch } from './search-context'

interface SidebarSearchProps extends FormHTMLAttributes<HTMLFormElement> {
  logo: ReactNode
  t: TFunction
}

export function SidebarSearch(props: SidebarSearchProps) {
  const { t } = props
  const searchContext = useSearch()

  if (!searchContext) {
    console.warn('⚠️ Search context is null, returning early.')
    return null
  }

  const { setIsOpen } = searchContext

  return (
    <div>
      {props.logo}
      <Sidebar.MenuButton className="relative p-0" onClick={() => setIsOpen(true)}>
        <Label htmlFor="search" className="sr-only">
          {t('component:navbar.search', 'Search')}
        </Label>
        <Input
          id="search"
          placeholder="Search"
          className="pl-[30px] transition-[width,padding-left] duration-150 ease-linear group-data-[state=collapsed]:w-[34px] group-data-[state=collapsed]:pl-1"
          autoComplete="off"
          spellCheck={false}
          theme="sidebar"
          tabIndex={-1}
          readOnly
        />
        <div className="absolute left-px top-px z-10 flex h-[calc(100%-2px)] w-[30px] items-center justify-center rounded bg-sidebar-background-1 text-sidebar-foreground-4 hover:text-sidebar-icon-1">
          <Icon name="search" size={12} className="ml-0.5" />
        </div>
        <Button
          variant="custom"
          size="icon"
          type="button"
          className="absolute right-1.5 top-1/2 z-[5px] h-5 -translate-y-1/2 select-none rounded-sm border border-sidebar-border-5 bg-background-3 p-0 px-1.5 text-sidebar-foreground-3 opacity-100 transition-opacity group-data-[state=collapsed]:opacity-0"
          tabIndex={-1}
        >
          <span className="size-full text-12">⌘K</span>
        </Button>
      </Sidebar.MenuButton>
    </div>
  )
}
