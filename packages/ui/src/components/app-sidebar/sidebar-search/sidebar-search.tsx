import { FormHTMLAttributes, ReactNode } from 'react'

import { IconV2, Input, Label } from '@/components'
import { useTranslation } from '@/context'

import { useSearch } from './search-context'

interface SidebarSearchProps extends FormHTMLAttributes<HTMLFormElement> {
  logo: ReactNode
}

export function SidebarSearch(props: SidebarSearchProps) {
  const { t } = useTranslation()
  const searchContext = useSearch()

  if (!searchContext) {
    console.warn('⚠️ Search context is null, returning early.')
    return null
  }

  const { setIsOpen } = searchContext

  return (
    <div>
      {props.logo}
      <button className="relative p-0" onClick={() => setIsOpen(true)}>
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

        <IconV2 name="search" size="2xs" />

        <span className="text-1 absolute right-1.5 top-1/2 z-[5px] size-full h-5 -translate-y-1/2 select-none rounded-sm border p-0 px-1.5 opacity-100 transition-opacity group-data-[state=collapsed]:opacity-0">
          ⌘K
        </span>
      </button>
    </div>
  )
}
