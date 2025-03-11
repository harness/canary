import { createContext, ReactNode, useContext, useEffect, useState } from 'react'

import { TFunction } from 'i18next'

import { CommandPaletteWrapper } from './command-palette-wrapper'

interface SearchContextType {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  searchTerm: string
  setSearchTerm: (term: string) => void
  selectedIndex: number
  setSelectedIndex: (index: number) => void
}

const SearchContext = createContext<SearchContextType | null>(null)

interface SearchProviderProps {
  children: ReactNode
  t: TFunction
}

export function SearchProvider({ children, t }: SearchProviderProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [selectedIndex, setSelectedIndex] = useState<number>(0)

  const toggleSearch = () => {
    setIsOpen(prev => !prev)
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        toggleSearch()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <SearchContext.Provider
      value={{
        isOpen,
        setIsOpen,
        searchTerm,
        setSearchTerm,
        selectedIndex,
        setSelectedIndex
      }}
    >
      {children}
      <CommandPaletteWrapper t={t} />
    </SearchContext.Provider>
  )
}

export function useSearch(): SearchContextType {
  const context = useContext(SearchContext)
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider')
  }
  return context
}
