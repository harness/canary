import { FC, useMemo, useState } from 'react'

import { DropdownMenu, SearchBox } from '@/components'
import { useTranslation } from '@/context'
import { CommitSelectorListItem } from '@views/repo/pull-request'

import { CommitSelectorDropdownProps } from '../../pull-request/pull-request.types'

const filterItems = (items: CommitSelectorListItem[], query: string) => {
  if (!query.trim()) return items

  return items.filter(item => item.title.toLowerCase().includes(query.toLowerCase().trim()))
}
export const CommitSelectorDropdown: FC<CommitSelectorDropdownProps> = ({
  selectedCommit,
  onSelectCommit,
  commitList
}) => {
  const [searchQuery, setSearchQuery] = useState('')

  const { t } = useTranslation()

  // TODO: Leave until be filtering can be done
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value)
  }
  const filteredItems = useMemo(() => {
    return filterItems(commitList, searchQuery)
  }, [commitList, searchQuery])

  return (
    <DropdownMenu.Content align="start">
      <DropdownMenu.Header>
        <SearchBox.Root
          className="w-full"
          placeholder={t('views:repos.search')}
          value={searchQuery}
          handleChange={handleSearchChange}
          showOnFocus
        />
      </DropdownMenu.Header>

      {filteredItems.length === 0 && <DropdownMenu.NoOptions>Nothing to show</DropdownMenu.NoOptions>}

      {filteredItems.map((item, idx) => {
        const isSelected = selectedCommit
          ? item.title === selectedCommit.title && item.sha === selectedCommit.sha
          : false

        return (
          <DropdownMenu.Item
            onClick={() => {
              onSelectCommit?.(item)
            }}
            key={item.title}
            checkmark={isSelected}
            title={item.title && idx === 0 ? `${item.title} (${commitList.length - 1})` : item.title}
          />
        )
      })}
    </DropdownMenu.Content>
  )
}
