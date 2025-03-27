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
    <form {...props}>
      {props.logo}
      <Sidebar.Group className="p-0">
        <Sidebar.GroupContent className="relative">
          <Label htmlFor="search" className="sr-only">
            {t('component:navbar.search', 'Search')}
          </Label>
          <Input
            id="search"
            placeholder="Search"
            className="cursor-pointer pl-[30px]"
            onClick={() => setIsOpen(true)}
            autoComplete="off"
            spellCheck={false}
            onFocus={e => e.target.blur()}
            theme="sidebar"
          />
          <Icon
            className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 select-none text-sidebar-foreground-4"
            name="search"
            size={12}
          />
          <Button
            variant="custom"
            size="icon"
            className="bg-sidebar-background-9 pointer-events-none absolute right-1.5 top-1/2 h-5 -translate-y-1/2 select-none rounded-sm border border-sidebar-border-5 p-0 px-1.5 text-sidebar-foreground-3"
          >
            <span className="size-full text-12">⌘K</span>
          </Button>
        </Sidebar.GroupContent>
      </Sidebar.Group>
    </form>
  )
}
