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
      <Sidebar.Group className="py-0">
        <Sidebar.GroupContent className="relative">
          <Label htmlFor="search" className="sr-only">
            {t('component:navbar.search')}
          </Label>
          <Input
            id="search"
            placeholder="Search"
            className="pl-8 cursor-pointer border-borders-1 focus:ring-0 focus-visible:outline-none"
            onClick={() => setIsOpen(true)}
            autoComplete="off"
            spellCheck={false}
            onFocus={e => e.target.blur()}
          />
          <Icon
            name="search"
            className="pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 select-none opacity-50"
          />
          <Button
            variant="secondary"
            size="icon"
            className="pointer-events-none absolute right-2 top-1/2 h-5 -translate-y-1/2 select-none opacity-100 px-1.5 border border-borders-2 rounded-sm p-0"
          >
            <span className="text-foreground-2 bg-background-3 size-full text-12">⌘K</span>
          </Button>
        </Sidebar.GroupContent>
      </Sidebar.Group>
    </form>
  )
}
