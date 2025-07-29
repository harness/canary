import { useMemo, useState } from 'react'

import { FileItem, FolderItem, Root } from '@components/file-explorer'

type TreeNode = FolderNode | FileNode

interface FileNode {
  type: 'file'
  name: string
  path: string
}

interface FolderNode {
  type: 'folder'
  name: string
  path: string
  children: TreeNode[]
}

export function buildFileTree(rawPaths: string[]): FolderNode[] {
  type FileTree = {
    name: string
    path: string
    type: 'file' | 'folder'
    children: Record<string, FileTree>
  }
  const root: Record<string, FileTree> = {}

  rawPaths.forEach(raw => {
    const parts = raw.split('/').filter(Boolean)
    let level = root
    let accum = ''

    parts.forEach((seg, i) => {
      accum = accum ? `${accum}/${seg}` : seg
      const leaf = i === parts.length - 1

      if (!level[seg]) {
        level[seg] = {
          name: seg,
          path: accum,
          type: leaf ? 'file' : 'folder',
          children: {}
        }
      } else if (!leaf && level[seg].type === 'file') {
        // upgrade file→folder if a deeper path exists
        level[seg].type = 'folder'
      }

      level = level[seg].children
    })
  })

  // 2) convert fileTree → TreeNode[]
  function fileTreeToNodes(fileTree: Record<string, FileTree>): TreeNode[] {
    return Object.values(fileTree)
      .sort((a, b) => {
        if (a.type !== b.type) return a.type === 'folder' ? -1 : 1
        return a.name.localeCompare(b.name)
      })
      .map(node =>
        node.type === 'folder'
          ? {
              type: 'folder' as const,
              name: node.name,
              path: node.path,
              children: fileTreeToNodes(node.children)
            }
          : {
              type: 'file' as const,
              name: node.name,
              path: node.path
            }
      )
  }

  // 3) flatten any pure‐folder chains
  function flatten(nodes: TreeNode[]): TreeNode[] {
    return nodes.map(node => {
      if (node.type === 'folder') {
        // first, flatten children recursively
        let kids = flatten(node.children)

        // then collapse chains of single‐child folders
        let mergedName = node.name
        let mergedPath = node.path

        while (kids.length === 1 && kids[0].type === 'folder') {
          const onlyChild = kids[0] as FolderNode
          mergedName = `${mergedName}/${onlyChild.name}`
          mergedPath = onlyChild.path
          kids = onlyChild.children
        }

        return {
          type: 'folder' as const,
          name: mergedName,
          path: mergedPath,
          children: kids
        }
      } else {
        return node
      }
    })
  }

  const rawTree = fileTreeToNodes(root)
  return flatten(rawTree) as FolderNode[]
}

interface PullRequestChangesExplorerProps {
  /** the raw list of full paths */
  paths: string[]
  /** currently selected file path (to highlight) */
  activePath?: string
  /** when folders open/close, fires with new array of open folder `value`s */
  onFolderValueChange?: (values: string[]) => void
}

export const PullRequestChangesExplorer: React.FC<PullRequestChangesExplorerProps> = ({
  paths,
  activePath,
  onFolderValueChange
}) => {
  // build once per paths change
  const tree = useMemo(() => buildFileTree(paths), [paths])

  // control which folders are open
  const [openFolders, setOpenFolders] = useState<string[]>([])

  const handleValueChange = (val: string | string[]) => {
    const arr = Array.isArray(val) ? val : [val]
    setOpenFolders(arr)
    onFolderValueChange?.(arr)
  }

  return (
    <Root value={openFolders} onValueChange={handleValueChange}>
      {renderTree(tree, activePath)}
    </Root>
  )
}

/** recursive renderer */
function renderTree(nodes: TreeNode[], activePath?: string): React.ReactNode[] {
  return nodes.map(node => {
    if (node.type === 'folder') {
      const isActive = activePath?.startsWith(node.path)
      return (
        <FolderItem
          key={node.path}
          value={node.path}
          link={node.path}
          isActive={isActive}
          content={<>{renderTree(node.children, activePath)}</>}
        >
          {node.name}
        </FolderItem>
      )
    } else {
      const isActive = activePath === node.path
      return (
        <FileItem key={node.path} link={node.path} isActive={isActive}>
          {node.name}
        </FileItem>
      )
    }
  })
}
