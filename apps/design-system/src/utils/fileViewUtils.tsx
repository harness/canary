import { OpenapiContentInfo } from '@subjects/views/repo-files/components/repo-files-store'

import { FileExplorer } from '@harnessio/ui/components'

export const sortEntriesByType = (entries: OpenapiContentInfo[]): OpenapiContentInfo[] => {
  return entries.sort((a, b) => {
    if (a.type === 'dir' && b.type === 'file') {
      return -1
    } else if (a.type === 'file' && b.type === 'dir') {
      return 1
    }
    return 0
  })
}

export const renderEntries = (entries: OpenapiContentInfo[], parentPath: string = '') => {
  const sortedEntries = sortEntriesByType(entries)
  return sortedEntries.map((item, idx) => {
    const itemPath = parentPath ? `${parentPath}/${item.name}` : item.name
    const fullPath = ''
    const level = (itemPath ?? '').split('/').length - 1

    if (item.type === 'file') {
      return (
        <FileExplorer.FileItem
          value={itemPath || ''}
          key={itemPath || idx.toString()}
          isActive={false}
          link={undefined}
          level={level}
        >
          {item.name}
        </FileExplorer.FileItem>
      )
    } else {
      return (
        <FileExplorer.FolderItem
          key={itemPath || idx.toString()}
          value={itemPath || ''}
          link={fullPath}
          isActive={false}
          level={level}
        >
          {item.name}
        </FileExplorer.FolderItem>
      )
    }
  })
}
