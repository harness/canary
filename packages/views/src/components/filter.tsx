import { useEffect, useState } from 'react'

import { isEmpty } from 'lodash-es'

import { ListActions, SearchBox } from '@harnessio/canary'

import { useCommonFilter } from '../hooks/useCommonFilter'

interface FilterProps {
  showSort?: boolean
  sortOptions?: ListActions.DropdownItemProps[]
  showSearch?: boolean
}

const Filter = <S,>({ showSort, sortOptions, showSearch = true }: FilterProps) => {
  const { sort, query, handleSearch, handleDropdownChange } = useCommonFilter<S>()
  const [value, setValue] = useState<string>()

  useEffect(() => {
    setValue(query || '')
  }, [query])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e?.target?.value)
    handleSearch(e)
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
              onChange={handleDropdownChange('sort')}
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
