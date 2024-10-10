import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { FileExplorer } from '@harnessio/playground'
import { OpenapiContentInfo, getContent, OpenapiGetContentOutput } from '@harnessio/code-service-client'
import { useGetRepoRef } from '../framework/hooks/useGetRepoPath'
import { normalizeGitRef } from '../utils/git-utils'
import { PathParams } from '../RouteDefinitions'

interface ExplorerProps {
  selectedBranch: string
  repoDetails: OpenapiGetContentOutput
}

const generateLocalStorageKey = (repoRef: string, gitRef: string, keyType: string) => {
  return `${repoRef}_${gitRef}_${keyType}`
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

export default function Explorer({ selectedBranch, repoDetails }: ExplorerProps) {
  const repoRef = useGetRepoRef()
  const { spaceId, repoId, resourcePath } = useParams<PathParams>()
  const subResourcePath = useParams()['*'] || ''
  const fullResourcePath = subResourcePath ? resourcePath + '/' + subResourcePath : resourcePath

  const uniqueOpenFoldersKey = generateLocalStorageKey(repoRef, selectedBranch, 'openFolderPaths')
  const uniqueFolderContentsKey = generateLocalStorageKey(repoRef, selectedBranch, 'folderContents')

  // Initialize state for openFolderPaths and folderContentsCache using unique keys for repoRef + gitRef
  const [openFolderPaths, setOpenFolderPaths] = useState<string[]>(() => {
    const storedPaths = localStorage.getItem(uniqueOpenFoldersKey)
    return storedPaths ? JSON.parse(storedPaths) : []
  })

  const [folderTree, setFolderTree] = useState<OpenapiContentInfo[]>([])

  const [folderContentsCache, setFolderContentsCache] = useState<{ [folderPath: string]: OpenapiContentInfo[] }>(() => {
    const storedFolderContents = localStorage.getItem(uniqueFolderContentsKey)
    return storedFolderContents ? JSON.parse(storedFolderContents) : {}
  })

  const mergeFolderTree = (initialEntries: OpenapiContentInfo[], existingTree: OpenapiContentInfo[]) => {
    const existingPaths = new Set(existingTree.map(entry => entry.path))

    const mergedTree = [...existingTree]
    initialEntries.forEach(entry => {
      if (!existingPaths.has(entry.path)) {
        mergedTree.push(entry)
      }
    })

    return mergedTree
  }

  const handleOpenFoldersChange = (newOpenFolderPaths: string[]) => {
    const newlyOpenedFolders = newOpenFolderPaths.filter(folderPath => !openFolderPaths.includes(folderPath))

    const foldersToFetch = newlyOpenedFolders.filter(folderPath => !folderContentsCache[folderPath])

    // Fetch contents for newly opened folders only if not already in cache
    foldersToFetch.forEach(folderPath => {
      fetchFolderContents(folderPath).then(contents => {
        setFolderContentsCache(prevContents => {
          const updatedCache = {
            ...prevContents,
            [folderPath]: contents
          }
          // Store folder contents for the current repoRef + gitRef
          localStorage.setItem(uniqueFolderContentsKey, JSON.stringify(updatedCache))
          return updatedCache
        })

        updateFolderTree(folderPath, contents)
      })
    })

    // Persist open folder paths for the current repoRef + gitRef
    localStorage.setItem(uniqueOpenFoldersKey, JSON.stringify(newOpenFolderPaths))
    setOpenFolderPaths(newOpenFolderPaths)
  }

  const fetchFolderContents = async (folderPath: string): Promise<OpenapiContentInfo[]> => {
    try {
      const response = await getContent({
        path: folderPath,
        repo_ref: repoRef,
        queryParams: { include_commit: false, git_ref: normalizeGitRef(selectedBranch) }
      })
      return response?.content?.entries || []
    } catch (error) {
      console.error(`Error fetching contents for folder "${folderPath}":`, error)
      return []
    }
  }

  const updateFolderTree = (folderPath: string, newContents: OpenapiContentInfo[]) => {
    const updateTreeRecursive = (entries: OpenapiContentInfo[], path: string): OpenapiContentInfo[] => {
      return entries.map(entry => {
        const currentPath = `${entry.path}`
        if (currentPath === path && entry.type === 'dir') {
          return { ...entry, entries: newContents }
        } else if (entry.type === 'dir' && entry.entries) {
          return { ...entry, entries: updateTreeRecursive(entry.entries, path) }
        }
        return entry
      })
    }

    setFolderTree(prevTree => updateTreeRecursive(prevTree, folderPath))
  }

  const renderEntries = (entries: OpenapiContentInfo[], parentPath: string = '') => {
    const sortedEntries = sortEntriesByType(entries)
    return sortedEntries.map((item, idx) => {
      const itemPath = parentPath ? `${parentPath}/${item.name}` : item.name
      const fullPath = `/${spaceId}/repos/${repoId}/code/${selectedBranch}/~/${itemPath}`

      if (item.type === 'file') {
        return (
          <Link to={fullPath}>
            <FileExplorer.FileItem
              key={itemPath || idx.toString()}
              isActive={itemPath === fullResourcePath}
              link={fullPath}>
              {item.name}
            </FileExplorer.FileItem>
          </Link>
        )
      } else {
        return (
          <FileExplorer.FolderItem
            key={itemPath || idx.toString()}
            value={itemPath}
            link={fullPath}
            isActive={itemPath === fullResourcePath}
            content={
              // If the folder's content is already cached, render it. Otherwise, show loading.
              folderContentsCache[itemPath] ? (
                <FileExplorer.Root onValueChange={handleOpenFoldersChange} value={openFolderPaths}>
                  {renderEntries(folderContentsCache[itemPath], itemPath)}
                </FileExplorer.Root>
              ) : (
                <div>Loading...</div>
              )
            }>
            {item.name}
          </FileExplorer.FolderItem>
        )
      }
    })
  }

  // Reset open folders and contents when the repoRef or gitRef changes
  useEffect(() => {
    // Clear the state and fetch new data based on new repoRef + gitRef combination
    setOpenFolderPaths(() => {
      const storedPaths = localStorage.getItem(uniqueOpenFoldersKey)
      return storedPaths ? JSON.parse(storedPaths) : []
    })

    setFolderContentsCache(() => {
      const storedFolderContents = localStorage.getItem(uniqueFolderContentsKey)
      return storedFolderContents ? JSON.parse(storedFolderContents) : {}
    })

    setFolderTree([]) // Clear folder tree to ensure new data is fetched
  }, [repoRef, selectedBranch])

  // Merge initial repo content entries into the folder tree when repoDetails change
  useEffect(() => {
    if (repoDetails?.content?.entries?.length) {
      setFolderTree(prevTree =>
        repoDetails?.content?.entries?.length ? mergeFolderTree(repoDetails.content.entries, prevTree) : prevTree
      )
    }
  }, [repoDetails?.content?.entries])

  return (
    <FileExplorer.Root onValueChange={handleOpenFoldersChange} value={openFolderPaths}>
      {folderTree.length && renderEntries(folderTree)}
    </FileExplorer.Root>
  )
}
