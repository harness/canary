export enum DirectionEnum {
  PARENT = 'parent',
  CHILD = 'child'
}

// Base properties that all entities must have
export interface BaseEntityProps {
  id: string
  name: string
  folderPath?: string
}

// Props for rendering a single entity item
export interface EntityRendererProps<T extends BaseEntityProps> {
  entity: T
  isSelected: boolean
  onSelect: (entity: T) => void
  showCheckbox?: boolean
}

export interface ParentFolderRendererProps<S = string> {
  parentFolder?: S | null
  onSelect: (scope: S) => void
}

export interface ChildFolderRendererProps<F = string> {
  folder?: F | null
  onSelect: (folder: F) => void
}
