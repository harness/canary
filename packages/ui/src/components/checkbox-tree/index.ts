import { CheckboxTreeGroup } from './checkbox-tree-group'
import { CheckboxTreeItem } from './checkbox-tree-item'
import { CheckboxTreeRoot } from './checkbox-tree-root'

export const CheckboxTree = {
  Root: CheckboxTreeRoot,
  Group: CheckboxTreeGroup,
  Item: CheckboxTreeItem
}

export type { CheckboxTreeRootProps, CheckboxTreeGroupProps, CheckboxTreeItemProps } from './checkbox-tree-types'
