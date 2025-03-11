export enum DirectionEnum {
  PARENT = 'parent',
  CHILD = 'child'
}

// Base properties that all entities must have
export interface BaseEntityProps {
  id: string
  name: string
}

// Props for rendering a single entity item
export interface EntityRendererProps<T extends BaseEntityProps> {
  entity: T
  isSelected: boolean
  onSelect: (entity: T) => void
}

// Props for the scope selector item
export interface ScopeSelectorProps<S = string> {
  parentFolder: S
  onSelect: (scope: S) => void
}

export interface FolderRendererProps<F = string> {
  folder: F
  onSelect: (folder: F) => void
}
