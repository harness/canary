import { useEffect, useState } from 'react'

import { ListActions, SearchBox } from '@/components'
import { isEmpty } from 'lodash-es'

interface FilterProps {
  showSort?: boolean
  sortOptions?: ListActions.DropdownItemProps[]
  showSearch?: boolean
  sort: string | null
  setSort: (sort: string) => void
  query: string | null
  setQuery: (query: string) => void
}

const Filter = ({ showSort, sortOptions, showSearch = true, sort, setSort, query, setQuery }: FilterProps) => {
  const [value, setValue] = useState<string>()

  useEffect(() => {
    setValue(query || '')
  }, [query])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e?.target?.value)
    setQuery(e?.target?.value)
  }

  return (
    <ListActions.Root>
      {showSearch && (
        <ListActions.Left>
          <SearchBox.Root
            width="full"
            className="max-w-96"
            value={value}
            handleChange={handleInputChange}
            placeholder="Search"
          />
        </ListActions.Left>
      )}
      {showSort && (
        <ListActions.Right>
          {!isEmpty(sortOptions) && (
            <ListActions.Dropdown
              selectedValue={sort as string | null}
              onChange={sort => {
                setSort(sort)
              }}
              title="Sort"
              items={sortOptions!}
            />
          )}
        </ListActions.Right>
      )}
    </ListActions.Root>
  )
}

export { Filter }
