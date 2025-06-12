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

/**
 * Default entity comparison function that checks ID and folder path
 */
export const defaultEntityComparator = <T extends BaseEntityProps>(entity1: T, entity2: T): boolean => {
  return entity1.id === entity2.id && entity1.folderPath === entity2.folderPath
}

// Props for rendering a single entity item
export interface EntityRendererProps<T extends BaseEntityProps> {
  entity: T
  isSelected: boolean
  onSelect: (entity: T) => void
  showCheckbox?: boolean
}

export interface ParentFolderRendererProps<S = string> {
  parentFolder: S
  onSelect: (scope: S) => void
}

export interface ChildFolderRendererProps<F = string> {
  folder: F
  onSelect: (folder: F) => void
}
