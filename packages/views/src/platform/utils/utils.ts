import { BaseEntityProps } from '../types'

/**
 * Default entity comparison function that checks ID and folder path
 */
export const defaultEntityComparator = <T extends BaseEntityProps>(entity1: T, entity2: T): boolean => {
  return entity1.id === entity2.id && entity1.folderPath === entity2.folderPath
}
