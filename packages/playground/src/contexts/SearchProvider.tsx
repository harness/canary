import React, { createContext, useState, useContext, ReactNode } from 'react'
import useShortcut from '../hooks/useShortcut'

interface SearchContextProps {
  isSearchOpen: boolean
  openSearch: () => void
  closeSearch: () => void
}

const SearchContext = createContext<SearchContextProps | undefined>(undefined)

export const useSearch = () => {
  const context = useContext(SearchContext)
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider')
  }
  return context
}

export const SearchProvider = ({ children }: { children: ReactNode }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  const openSearch = () => setIsSearchOpen(true)
  const closeSearch = () => setIsSearchOpen(false)

  useShortcut('k', openSearch) // Cmd/Ctrl + K opens the search

  return (
    <SearchContext.Provider value={{ isSearchOpen, openSearch, closeSearch }}>
      {children}
      {isSearchOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center">
          <div className="bg-white p-6 rounded-md w-96">
            <input type="text" placeholder="Type to search..." className="w-full p-2 border rounded" />
            <button onClick={closeSearch} className="mt-4 p-2 bg-blue-500 text-white rounded">
              Close
            </button>
          </div>
        </div>
      )}
    </SearchContext.Provider>
  )
}
