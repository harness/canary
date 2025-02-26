// import { Search } from "lucide-react";

import { FormHTMLAttributes } from 'react'

import { Button } from '@components/button'
import { Label } from '@components/form-primitives'
// import { useSearch } from '@/context/SearchContext'
import { Icon } from '@components/icon'
import { Input } from '@components/input'
import { Sidebar } from '@components/sidebar/sidebar'
import { TFunction } from 'i18next'

// import { Button, Command, Input, Label } from '@harnessio/ui/components'

interface SidebarSearchProps extends FormHTMLAttributes<HTMLFormElement> {
  t: TFunction
}

export function SidebarSearch(props: SidebarSearchProps) {
  // const searchContext = useSearch()

  // if (!searchContext) {
  //   console.warn('⚠️ Search context is null, returning early.')
  //   return null
  // }

  // const { setIsOpen } = searchContext

  return (
    <form {...props}>
      <Sidebar.Group className="py-0 -mt-2 px-2">
        <Sidebar.GroupContent className="relative">
          <Label htmlFor="search" className="sr-only">
            Search
          </Label>
          <Input
            id="search"
            placeholder="Search"
            className="pl-8 cursor-pointer border-borders-1"
            onClick={undefined}
            autoComplete="off"
            spellCheck={false}
            onFocus={e => e.target.blur()}
          />
          <Icon
            name="search"
            size={16}
            className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 select-none opacity-50"
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
