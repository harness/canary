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

interface ExplorerPathsProviderProps {
  children: React.ReactNode
}

export const ExplorerPathsProvider: React.FC<ExplorerPathsProviderProps> = ({ children }) => {
  const repoRef = useGetRepoRef()
  const { gitRef } = useParams<PathParams>()
  const [openFolderPaths, setOpenFolderPaths] = useState<string[]>([])

  const prevRepoRef = useRef(repoRef)
  const prevGitRef = useRef(gitRef)

  useEffect(() => {
    if (prevRepoRef.current !== repoRef || prevGitRef.current !== gitRef) {
      setOpenFolderPaths([])
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
