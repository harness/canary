import { memo, RefObject, useEffect, useMemo, useRef, useState } from 'react'

import { FileExplorer, Layout, StatusBadge } from '@/components'

type TreeNode = FolderNode | FileNode

interface FileNode {
  type: 'file'
  name: string
  path: string
  level: number
}

interface FolderNode {
  type: 'folder'
  name: string
  path: string
  level: number
  children: TreeNode[]
}

export interface ExplorerDiffData {
  addedLines: number
  deletedLines: number
  lang: string
  filePath: string
  isDeleted: boolean
  unchangedPercentage: number
}

/**
 * Assigns correct nesting levels to all nodes based on their position in the tree
 * @param nodes - Tree nodes without level property
 * @param currentLevel - Current nesting level (starts at 0)
 * @returns Tree nodes with level property added
 */
function assignLevels(nodes: Omit<TreeNode, 'level'>[], currentLevel: number = 0): TreeNode[] {
  return nodes.map(node => {
    if (node.type === 'folder') {
      return {
        ...node,
        level: currentLevel,
        children: assignLevels((node as FolderNode).children, currentLevel + 1)
      } as FolderNode
    } else {
      return {
        ...node,
        level: currentLevel
      } as FileNode
    }
  })
}

/**
 * Builds a hierarchical file tree from flat file paths for UI rendering.
 * STEPS:
 * 1. Tree Construction: Iteratively builds nested object structure from path segments
 * 2. Type Inference: determines file vs folder based on path position
 * 3. Flattening: Collapses single-child folder chains for better UX
 * @param rawPaths - Array of file paths (e.g., ["src/utils.ts", "README.md"])
 * @returns Hierarchical tree structure optimized for React rendering
 */
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

  // convert fileTree → TreeNode[]
  function fileTreeToNodes(fileTree: Record<string, FileTree>): TreeNode[] {
    return Object.values(fileTree).map(node =>
      node.type === 'folder'
        ? {
            type: 'folder' as const,
            name: node.name,
            path: node.path,
            children: fileTreeToNodes(node.children),
            level: 0
          }
        : {
            type: 'file' as const,
            name: node.name,
            path: node.path,
            level: 0
          }
    )
  }

  /* flatten any pure folder chains
   * Prevents deeply nested single folders (e.g., "src" → "components" → "ui") ->  "src/components/ui" as single node
   */
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
          children: kids,
          level: 0
        }
      } else {
        return node
      }
    })
  }

  const rawTree = fileTreeToNodes(root)
  const flattenedTree = flatten(rawTree)
  const treeWithLevels = assignLevels(flattenedTree)

  return treeWithLevels as FolderNode[]
}

/**
 * Flattens file tree into linear array.
 * @param rawPaths - Array of file paths to process
 * @returns File paths
 */
export function getFilePathsInTreeOrder(rawPaths: string[]): string[] {
  type FileTree = {
    name: string
    path: string
    type: 'file' | 'folder'
    children: Record<string, FileTree>
  }
  const root: Record<string, FileTree> = {}

  // Build the same tree structure as buildFileTree
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
        level[seg].type = 'folder'
      }

      level = level[seg].children
    })
  })

  function flattenTreePaths(fileTree: Record<string, FileTree>): string[] {
    return Object.values(fileTree).flatMap(node => {
      if (node.type === 'folder') {
        return flattenTreePaths(node.children)
      } else {
        return [node.path]
      }
    })
  }

  return flattenTreePaths(root)
}

interface PullRequestChangesExplorerProps {
  paths: string[]
  activeDiff?: string
  onFolderValueChange?: (values: string[]) => void
  goToDiff: (fileName: string) => void
  diffsData?: ExplorerDiffData[]
  scrollAreaRef?: RefObject<HTMLDivElement>
}

export const PullRequestChangesExplorer: React.FC<PullRequestChangesExplorerProps> = memo(
  ({ paths, activeDiff, onFolderValueChange, goToDiff, diffsData, scrollAreaRef }) => {
    // build once per paths change
    const tree = useMemo(() => buildFileTree(paths), [paths])

    // Track the last paths we initialized folders for
    const lastInitializedPaths = useRef<string>('')

    // Extract all folder paths from tree for default expanded state
    const allFolderPaths = useMemo(() => {
      function extractFolderPaths(nodes: TreeNode[]): string[] {
        const folderPaths: string[] = []

        nodes.forEach(node => {
          if (node.type === 'folder') {
            folderPaths.push(node.path)
            // Recursively collect folder paths from children
            folderPaths.push(...extractFolderPaths(node.children))
          }
        })

        return folderPaths
      }

      return extractFolderPaths(tree)
    }, [tree])

    // control which folders are open - initialize with all folders expanded
    const [openFolders, setOpenFolders] = useState<string[]>(() => allFolderPaths)

    // Only reset folders when paths actually change
    const pathsKey = paths.join(',')
    if (pathsKey !== lastInitializedPaths.current) {
      lastInitializedPaths.current = pathsKey
      // Only call setOpenFolders if not in initial render
      if (lastInitializedPaths.current !== '') {
        setOpenFolders(allFolderPaths)
      }
    }

    const handleValueChange = (val: string | string[]) => {
      const arr = Array.isArray(val) ? val : [val]
      setOpenFolders(arr)
      onFolderValueChange?.(arr)
    }

    useEffect(() => {
      if (activeDiff) {
        // Small delay to ensure the file item and diff is rendered
        const timeoutId = setTimeout(() => {
          const activeElement = scrollAreaRef?.current?.querySelector(
            `[data-explorer-path="${activeDiff}"]`
          ) as HTMLElement

          if (activeElement && scrollAreaRef?.current) {
            const scrollContainer = scrollAreaRef.current.parentElement as HTMLDivElement

            // Get the element's position relative to the actual scroll container
            const elementRect = activeElement.getBoundingClientRect()
            const viewportRect = scrollContainer.getBoundingClientRect()

            // Calculate element position relative to the scroll container's content area
            const elementTop = elementRect.top - viewportRect.top + scrollContainer.scrollTop
            const elementHeight = elementRect.height
            const elementBottom = elementTop + elementHeight

            // Get the viewport's current scroll position and visible area
            const containerScrollTop = scrollContainer.scrollTop
            const containerHeight = scrollContainer.getBoundingClientRect().height
            const visibleTop = containerScrollTop
            const visibleBottom = containerScrollTop + containerHeight

            // Check if element is fully visible within the scrollable viewport
            const isVisible = elementTop >= visibleTop && elementBottom <= visibleBottom

            if (!isVisible) {
              activeElement.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' })
            }
          }
        }, 500)

        return () => clearTimeout(timeoutId)
      }
    }, [activeDiff])

    return (
      <FileExplorer.Root value={openFolders} onValueChange={handleValueChange}>
        {renderTree(tree, goToDiff, activeDiff, diffsData)}
      </FileExplorer.Root>
    )
  }
)

PullRequestChangesExplorer.displayName = 'PullRequestChangesExplorer'

/**
 * Recursively renders tree structure into React file explorer components.
 * @param nodes - Tree nodes to render at current level
 * @param goToDiff - Navigation handler for file selection
 * @param activeDiff - Currently active file path for highlighting
 * @returns Array of React elements representing the tree structure
 */
function renderTree(
  nodes: TreeNode[],
  goToDiff: (fileName: string) => void,
  activeDiff?: string,
  diffsData?: ExplorerDiffData[]
): React.ReactNode[] {
  return nodes.map(({ level, ...node }) => {
    if (node.type === 'folder') {
      return (
        <FileExplorer.FolderItem
          key={node.path}
          value={node.path}
          level={level}
          content={<>{renderTree(node.children, goToDiff, activeDiff, diffsData)}</>}
        >
          {node.name}
        </FileExplorer.FolderItem>
      )
    } else {
      const isActive = activeDiff === node.path
      const addedLines = getDiffFileAddedLines(diffsData || [], node.path)
      const deletedLines = getDiffFileDeletedLines(diffsData || [], node.path)
      return (
        <FileExplorer.FileItem
          value={node.path}
          key={node.path}
          isActive={isActive}
          level={level}
          onClick={() => goToDiff(node.path)}
          tooltip={
            <Layout.Flex gapX="3xs" align="center">
              {addedLines > 0 && (
                <StatusBadge variant="secondary" size="sm" theme="success">
                  +{addedLines}
                </StatusBadge>
              )}
              {deletedLines > 0 && (
                <StatusBadge variant="secondary" size="sm" theme="danger">
                  -{deletedLines}
                </StatusBadge>
              )}
            </Layout.Flex>
          }
          data-explorer-path={node.path}
        >
          {node.name}
        </FileExplorer.FileItem>
      )
    }
  })
}

function getDiffFileAddedLines(diffsData: ExplorerDiffData[], filePath: string): number {
  const diff = diffsData?.find(diff => diff.filePath === filePath)
  return diff?.addedLines || 0
}

function getDiffFileDeletedLines(diffsData: ExplorerDiffData[], filePath: string): number {
  const diff = diffsData?.find(diff => diff.filePath === filePath)
  return diff?.deletedLines || 0
}
