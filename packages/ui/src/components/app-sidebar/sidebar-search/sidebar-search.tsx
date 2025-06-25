import { FormHTMLAttributes, ReactNode } from 'react'

import { Layout, SearchInput, Text } from '@/components'
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
    <Layout.Grid gapY="md">
      {props.logo}
      <button className="max-w-full overflow-hidden" onClick={() => setIsOpen(true)}>
        <SearchInput
          size="sm"
          placeholder={t('component:navbar.search', 'Search')}
          className="pointer-events-none"
          inputContainerClassName="[&>.cn-input-prefix]:w-[34px] max-w-full overflow-hidden"
          suffix={
            <Text
              variant="caption-soft"
              className="text-cn-foreground-2 border-cn-borders-2 mr-1.5 flex h-5 select-none items-center rounded-sm border px-1 opacity-100 transition-opacity group-data-[state=collapsed]:opacity-0"
            >
              ⌘K
            </Text>
          }
          readOnly
          aria-hidden="true"
          tabIndex={-1}
        />
      </button>
    </Layout.Grid>
  )
}
