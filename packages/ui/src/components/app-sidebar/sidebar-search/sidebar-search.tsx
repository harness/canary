import { SearchInput } from '@/components'
import { useTranslation } from '@/context'
import { Shortcut } from '@components/shortcut'

import { useSearch } from './search-context'

export function SidebarSearch() {
  const { t } = useTranslation()
  const searchContext = useSearch()

  if (!searchContext) {
    console.warn('⚠️ Search context is null, returning early.')
    return null
  }

  const { setIsOpen } = searchContext

  return (
    <button className="max-w-full overflow-hidden" onClick={() => setIsOpen(true)}>
      <SearchInput
        size="sm"
        placeholder={t('component:navbar.search', 'Search')}
        className="pointer-events-none"
        inputContainerClassName="border-cn-2 max-w-full overflow-hidden"
        suffix={<Shortcut className="mr-1.5 transition-opacity group-data-[state=collapsed]:opacity-0">⌘K</Shortcut>}
        readOnly
        aria-hidden="true"
        tabIndex={-1}
      />
    </button>
  )
}
