import { FC, ReactNode, useEffect } from 'react'
import { useLocation, useParams } from 'react-router-dom'

import { useQuery, useQueryClient } from '@tanstack/react-query'

import { getContent, OpenapiContentInfo, OpenapiGetContentOutput } from '@harnessio/code-service-client'
import { FileExplorer } from '@harnessio/ui/components'

import { useOpenFolderPaths } from '../framework/context/ExplorerPathsContext'
import { useRoutes } from '../framework/context/NavigationContext'
import { useGetRepoRef } from '../framework/hooks/useGetRepoPath'
import useCodePathDetails from '../hooks/useCodePathDetails'
import { PathParams } from '../RouteDefinitions'
import { normalizeGitRef } from '../utils/git-utils'

/**
 * ExplorerProps:
 * - In API mode (default), repoDetails is used (and data is fetched on demand).
 * - In Static mode, the parent passes a complete tree via the "entries" prop and sets isStaticEntries={true}.
 */
interface ExplorerProps {
  selectedBranch?: string
  repoDetails?: OpenapiGetContentOutput
  entries?: ExplorerStaticContentInfo[] // static enteries
  isStaticEntries?: boolean
}

export interface ExplorerStaticContentInfo extends OpenapiContentInfo {
  entries?: ExplorerStaticContentInfo[]
}

const sortEntriesByType = (entries: OpenapiContentInfo[]): OpenapiContentInfo[] => {
  return entries.sort((a, b) => {
    if (a.type === 'dir' && b.type === 'file') return -1
    if (a.type === 'file' && b.type === 'dir') return 1
    return 0
  })
}

/**
 * Helper for static mode: Given a complete tree and a folder path,
 * return the entries inside that folder.
 */
const getStaticFolderEntries = (
  entries: ExplorerStaticContentInfo[],
  folderPath: string
): OpenapiContentInfo[] | undefined => {
  if (!folderPath) return entries
  const parts = folderPath.split('/')
  let currentEntries = entries
  for (const part of parts) {
    const found = currentEntries.find(entry => entry.name === part && entry.type === 'dir')
    if (!found) return undefined
    currentEntries = found.entries || []
  }
  return currentEntries
}

export default function Explorer({ selectedBranch, repoDetails, entries, isStaticEntries = false }: ExplorerProps) {
  const repoRef = useGetRepoRef()
  const { spaceId, repoId } = useParams<PathParams>()
  const { fullGitRef, fullResourcePath } = useCodePathDetails()
  const location = useLocation()
  const isFileEditMode = location.pathname.includes('edit')
  const queryClient = useQueryClient()
  const { openFolderPaths, setOpenFolderPaths } = useOpenFolderPaths()
  const routes = useRoutes()

  console.log('root enteries,', repoDetails?.content?.entries)

  // Updates the open folder state and, if not staticEnteries, prefetches new folder contents.
  const handleOpenFoldersChange = (newOpenFolderPaths: string[]) => {
    const newlyOpenedFolders = newOpenFolderPaths.filter(path => !openFolderPaths.includes(path))
    if (!isStaticEntries) {
      newlyOpenedFolders.forEach(folderPath => {
        queryClient.prefetchQuery(
          ['folderContents', repoRef, fullGitRef || selectedBranch, folderPath],
          () => fetchFolderContents(folderPath),
          { staleTime: 300000, cacheTime: 900000 }
        )
      })
    }
    setOpenFolderPaths(newOpenFolderPaths)
  }

  // Data fetching / Static Entries lookup
  const fetchFolderContents = async (folderPath: string): Promise<OpenapiContentInfo[]> => {
    try {
      const { body: response } = await getContent({
        path: folderPath,
        repo_ref: repoRef,
        queryParams: { include_commit: false, git_ref: normalizeGitRef(fullGitRef || selectedBranch) }
      })
      return response?.content?.entries || []
    } catch (error) {
      console.error(`Error fetching contents for folder "${folderPath}":`, error)
      return []
    }
  }

  // Unified hook: in static mode: perform a lookup, otherwise use React Query;
  const useFolderContents = (folderPath: string) => {
    if (!isStaticEntries) {
      return useQuery<OpenapiContentInfo[]>(
        ['folderContents', repoRef, fullGitRef || selectedBranch, folderPath],
        () => fetchFolderContents(folderPath),
        { staleTime: 300000, cacheTime: 900000 }
      )
    } else {
      const staticData = entries ? getStaticFolderEntries(entries, folderPath) : undefined
      return { data: staticData, isLoading: false, error: undefined }
    }
  }

  // Root entries: either fetched from API or provided statically.
  const {
    data: rootEntries,
    isLoading: isRootLoading,
    error: rootError
  } = !isStaticEntries
    ? useQuery(['folderContents', repoRef, fullGitRef || selectedBranch, ''], () => fetchFolderContents(''), {
        staleTime: 300000,
        cacheTime: 900000,
        initialData: repoDetails?.content?.entries
      })
    : { data: entries, isLoading: false, error: undefined }

  // Recursively renders a list of folder/file entries.
  const renderEntries = (entries: OpenapiContentInfo[], parentPath: string = ''): ReactNode[] => {
    const sorted = sortEntriesByType(entries)
    return sorted.map((item, idx) => {
      const itemPath = parentPath ? `${parentPath}/${item.name}` : item.name
      const fullPath = `${routes.toRepoFiles({ spaceId, repoId })}/${fullGitRef || selectedBranch}/~/${itemPath}`
      if (item.type === 'file') {
        return (
          <FileExplorer.FileItem
            key={itemPath || idx.toString()}
            isActive={itemPath === fullResourcePath}
            link={isFileEditMode && itemPath === fullResourcePath ? undefined : fullPath}
          >
            {item.name}
          </FileExplorer.FileItem>
        )
      } else {
        return (
          <FileExplorer.FolderItem
            key={itemPath || idx.toString()}
            value={itemPath}
            link={fullPath}
            isActive={itemPath === fullResourcePath}
            content={
              <FolderContents
                folderPath={itemPath || ''}
                isOpen={openFolderPaths.includes(itemPath || '')}
                renderEntries={renderEntries}
                handleOpenFoldersChange={handleOpenFoldersChange}
                openFolderPaths={openFolderPaths}
              />
            }
          >
            {item.name}
          </FileExplorer.FolderItem>
        )
      }
    })
  }

  interface FolderContentsProps {
    folderPath: string
    isOpen: boolean
    renderEntries: (entries: OpenapiContentInfo[], parentPath: string) => ReactNode[]
    handleOpenFoldersChange: (newOpenFolderPaths: string[]) => void
    openFolderPaths: string[]
  }

  const FolderContents: FC<FolderContentsProps> = ({
    folderPath,
    isOpen,
    renderEntries,
    handleOpenFoldersChange,
    openFolderPaths
  }) => {
    const { data: contents, isLoading, error } = useFolderContents(folderPath)
    if (!isOpen) return null
    if (isLoading) return <div>Loading...</div>
    if (error) return <div>Error loading folder contents</div>
    return (
      <FileExplorer.Root
        onValueChange={value => {
          if (typeof value === 'string') handleOpenFoldersChange([value])
          else handleOpenFoldersChange(value)
        }}
        value={openFolderPaths}
      >
        {contents && renderEntries(contents, folderPath)}
      </FileExplorer.Root>
    )
  }

  // Automatically expand folders along the current fullResourcePath ie the current open folder/file
  useEffect(() => {
    const expandFoldersAlongPath = async () => {
      if (fullResourcePath) {
        const segments = fullResourcePath.split('/')
        const isFile = segments[segments.length - 1].includes('.') && !segments[segments.length - 1].startsWith('.')
        const folderSegments = isFile ? segments.slice(0, -1) : segments
        const folderPaths: string[] = []
        let current = ''
        folderSegments.forEach(segment => {
          current = current ? `${current}/${segment}` : segment
          folderPaths.push(current)
        })
        setOpenFolderPaths(prev => Array.from(new Set([...prev, ...folderPaths])))
        if (!isStaticEntries) {
          for (const folderPath of folderPaths) {
            queryClient.prefetchQuery(
              ['folderContents', repoRef, fullGitRef || selectedBranch, folderPath],
              () => fetchFolderContents(folderPath),
              { staleTime: 300000, cacheTime: 900000 }
            )
          }
        }
      }
    }
    expandFoldersAlongPath()
  }, [fullResourcePath, isStaticEntries, queryClient, repoRef, fullGitRef, selectedBranch, setOpenFolderPaths])

  return (
    <FileExplorer.Root
      onValueChange={value => {
        if (typeof value === 'string') handleOpenFoldersChange([value])
        else handleOpenFoldersChange(value)
      }}
      value={openFolderPaths}
    >
      {isRootLoading ? (
        <div>Loading...</div>
      ) : rootError ? (
        <div>Error loading root folder</div>
      ) : (
        rootEntries && renderEntries(rootEntries, '')
      )}
    </FileExplorer.Root>
  )
}
