import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'

import { PathParams } from '../../RouteDefinitions'
import { useGetRepoRef } from '../hooks/useGetRepoPath'

interface ExplorerPathsContextType {
  openFolderPaths: string[]
  setOpenFolderPaths: React.Dispatch<React.SetStateAction<string[]>>
}

const ExplorerPathsContext = createContext<ExplorerPathsContextType | undefined>(undefined)

export const useOpenFolderPaths = () => {
  const context = useContext(ExplorerPathsContext)
  if (!context) {
    throw new Error('useOpenFolderPaths must be used within an ExplorerPathsProvider')
  }
  return context
}

export const STORAGE_KEY = '_explorer_paths'

// Helper functions for localStorage
const getStorageKey = (repoRef: string, gitRef: string | undefined) =>
  `${STORAGE_KEY}_${repoRef}_${gitRef || 'default'}`

const getPathsFromStorage = (key: string): string[] => {
  try {
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error('Error reading from localStorage:', error)
    return []
  }
}

const savePathsToStorage = (key: string, paths: string[]): void => {
  try {
    localStorage.setItem(key, JSON.stringify(paths))
  } catch (error) {
    console.error('Error writing to localStorage:', error)
  }
}

interface ExplorerPathsProviderProps {
  children: React.ReactNode
}

export const ExplorerPathsProvider: React.FC<ExplorerPathsProviderProps> = ({ children }) => {
  const repoRef = useGetRepoRef()
  const { gitRef } = useParams<PathParams>()
  const storageKey = getStorageKey(repoRef, gitRef)

  // Initialize from localStorage
  const [openFolderPaths, setOpenFolderPathsState] = useState<string[]>(() => {
    return getPathsFromStorage(storageKey)
  })

  const prevRepoRef = useRef(repoRef)
  const prevGitRef = useRef(gitRef)

  // Custom setter that updates both state and localStorage
  const setOpenFolderPaths = (newPathsOrUpdater: React.SetStateAction<string[]>) => {
    setOpenFolderPathsState(currentPaths => {
      const newPaths = typeof newPathsOrUpdater === 'function' ? newPathsOrUpdater(currentPaths) : newPathsOrUpdater

      // Save to localStorage
      savePathsToStorage(storageKey, newPaths)
      return newPaths
    })
  }

  // Reset paths when repo or git ref changes
  useEffect(() => {
    if (prevRepoRef.current !== repoRef || prevGitRef.current !== gitRef) {
      const newKey = getStorageKey(repoRef, gitRef)
      const savedPaths = getPathsFromStorage(newKey)

      setOpenFolderPathsState(savedPaths)
      prevRepoRef.current = repoRef
      prevGitRef.current = gitRef
    }
  }, [repoRef, gitRef])

  return (
    <ExplorerPathsContext.Provider value={{ openFolderPaths, setOpenFolderPaths }}>
      {children}
    </ExplorerPathsContext.Provider>
  )
}
