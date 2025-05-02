import { createContext, ReactNode, useContext, useState } from 'react'

import { noop } from 'lodash-es'

import { SortDirection, SortOption, SortValue } from './type'

interface SortContextProps {
  sortOptions: SortOption[]
  sortDirections: SortDirection[]
  sortSelections: SortValue[]
  updateSortSelections: (sortSelections: SortValue[]) => void
  sortOpen: boolean
  setSortOpen: (sortOpen: boolean) => void
}

export const DefaultSortDirections = [
  { label: 'Ascending', value: 'asc' as const },
  { label: 'Descending', value: 'desc' as const }
]

const SortContext = createContext<SortContextProps>({
  sortDirections: DefaultSortDirections,
  sortOptions: [],
  sortSelections: [],
  updateSortSelections: noop,
  sortOpen: false,
  setSortOpen: noop
})

const SortProvider = ({
  children,
  sortOptions,
  sortDirections,
  sortSelections,
  updateSortSelections
}: {
  children: ReactNode
  sortOptions: SortOption[]
  sortDirections?: SortDirection[]
  sortSelections: SortValue[]
  updateSortSelections: (sortSelections: SortValue[]) => void
}) => {
  const [sortOpen, setSortOpen] = useState(false)
  return (
    <SortContext.Provider
      value={{
        sortOptions,
        sortDirections: sortDirections || DefaultSortDirections,
        sortSelections,
        updateSortSelections,
        sortOpen,
        setSortOpen
      }}
    >
      {children}
    </SortContext.Provider>
  )
}

const useSort = () => useContext(SortContext)

export { SortProvider, useSort }
