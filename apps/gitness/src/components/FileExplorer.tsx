import { useEffect } from 'react'
import { useLocation, useParams } from 'react-router-dom'

import { useQuery, useQueryClient } from '@tanstack/react-query'

import { getContent, OpenapiContentInfo, OpenapiGetContentOutput } from '@harnessio/code-service-client'
import { FileExplorer } from '@harnessio/ui/components'

import { useOpenFolderPaths } from '../framework/context/ExplorerPathsContext'
import { useGetRepoRef } from '../framework/hooks/useGetRepoPath'
import useCodePathDetails from '../hooks/useCodePathDetails'
import { PathParams } from '../RouteDefinitions'
import { normalizeGitRef } from '../utils/git-utils'

interface ExplorerProps {
  selectedBranch: string
  repoDetails: OpenapiGetContentOutput
}

const sortEntriesByType = (entries: OpenapiContentInfo[]): OpenapiContentInfo[] => {
  return entries.sort((a, b) => {
    if (a.type === 'dir' && b.type === 'file') {
      return -1
    } else if (a.type === 'file' && b.type === 'dir') {
      return 1
    }
    return 0
  })
}

/**
 * TODO: This code was migrated from V2 and needs to be refactored.
 */
export default function Explorer({ selectedBranch, repoDetails }: ExplorerProps) {
  const repoRef = useGetRepoRef()
  const { spaceId, repoId } = useParams<PathParams>()
  const { fullGitRef, fullResourcePath } = useCodePathDetails()
  const location = useLocation()
  const isFileEditMode = location.pathname.includes('edit')
  const queryClient = useQueryClient()
  const { openFolderPaths, setOpenFolderPaths } = useOpenFolderPaths()

  const handleOpenFoldersChange = (newOpenFolderPaths: string[]) => {
    const newlyOpenedFolders = newOpenFolderPaths.filter(path => !openFolderPaths.includes(path))

    // contents for newly opened folders
    newlyOpenedFolders.forEach(folderPath => {
      queryClient.prefetchQuery(
        ['folderContents', repoRef, fullGitRef || selectedBranch, folderPath],
        () => fetchFolderContents(folderPath),
        {
          staleTime: 300000,
          cacheTime: 900000
        }
      )
    })

    setOpenFolderPaths(newOpenFolderPaths)
  }

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

  const useFolderContents = (folderPath: string) => {
    return useQuery<OpenapiContentInfo[]>(
      ['folderContents', repoRef, fullGitRef || selectedBranch, folderPath],
      () => fetchFolderContents(folderPath),
      {
        staleTime: 300000,
        cacheTime: 900000
      }
    )
  }

  const renderEntries = (entries: OpenapiContentInfo[], parentPath: string = '') => {
    const sortedEntries = sortEntriesByType(entries)
    return sortedEntries.map((item, idx) => {
      const itemPath = parentPath ? `${parentPath}/${item.name}` : item.name
      const fullPath = `/${spaceId}/repos/${repoId}/code/${fullGitRef || selectedBranch}/~/${itemPath}`

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
                isOpen={openFolderPaths.includes(itemPath!)}
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

  const FolderContents = ({
    folderPath,
    isOpen,
    renderEntries,
    handleOpenFoldersChange,
    openFolderPaths
  }: {
    folderPath: string
    isOpen: boolean
    renderEntries: (entries: OpenapiContentInfo[], parentPath: string) => React.ReactNode[]
    handleOpenFoldersChange: (newOpenFolderPaths: string[]) => void
    openFolderPaths: string[]
  }) => {
    const { data: contents, isLoading, error } = useFolderContents(folderPath)

    if (!isOpen) {
      return null
    }

    if (isLoading) {
      return <div>Loading...</div>
    }

    if (error) {
      return <div>Error loading folder contents</div>
    }

    return (
      <FileExplorer.Root
        onValueChange={value => {
          if (typeof value === 'string') {
            handleOpenFoldersChange([value])
          } else {
            handleOpenFoldersChange(value)
          }
        }}
        value={openFolderPaths}
      >
        {contents && renderEntries(contents, folderPath)}
      </FileExplorer.Root>
    )
  }

  useEffect(() => {
    // Automatically expand folders along the fullResourcePath
    const expandFoldersAlongPath = async () => {
      if (fullResourcePath) {
        const pathSegments = fullResourcePath.split('/')
        const isFile = pathSegments[pathSegments.length - 1].includes('.')
        const folderSegments = isFile ? pathSegments.slice(0, -1) : pathSegments

        const folderPaths: string[] = []
        let currentPath = ''
        folderSegments.forEach(segment => {
          currentPath = currentPath ? `${currentPath}/${segment}` : segment
          folderPaths.push(currentPath)
        })

        // Update openFolderPaths
        setOpenFolderPaths(prevOpenFolderPaths => {
          const newOpenFolderPaths = [...prevOpenFolderPaths]
          folderPaths.forEach(folderPath => {
            if (!newOpenFolderPaths.includes(folderPath)) {
              newOpenFolderPaths.push(folderPath)
            }
          })
          return newOpenFolderPaths
        })

        // Prefetch contents for folders along the path
        for (const folderPath of folderPaths) {
          queryClient.prefetchQuery(
            ['folderContents', repoRef, fullGitRef || selectedBranch, folderPath],
            () => fetchFolderContents(folderPath),
            {
              staleTime: 300000,
              cacheTime: 900000
            }
          )
        }
      }
    }
    expandFoldersAlongPath()
  }, [fullResourcePath])

  // Fetch root contents
  const {
    data: rootEntries,
    isLoading: isRootLoading,
    error: rootError
  } = useQuery(['folderContents', repoRef, fullGitRef || selectedBranch, ''], () => fetchFolderContents(''), {
    staleTime: 300000,
    cacheTime: 900000,
    initialData: repoDetails?.content?.entries
  })

  return (
    <FileExplorer.Root
      onValueChange={value => {
        if (typeof value === 'string') {
          handleOpenFoldersChange([value])
        } else {
          handleOpenFoldersChange(value)
        }
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
