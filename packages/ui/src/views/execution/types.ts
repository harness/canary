import { type TreeViewElement } from '@/components'

export interface LivelogLine {
  out?: string
  pos?: number
  time?: number
}

export interface ExecutionTreeProps {
  defaultSelectedId: string
  elements: TreeViewElement[]
  onSelectNode: ({ parentId, childId }: { parentId: string; childId: string }) => void
}
