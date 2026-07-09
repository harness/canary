import { forwardRef } from 'react'

import { Checkbox, Layout, Text } from '@/components'
import { cn } from '@utils/cn'

import { useCheckboxTree, useParent, useRegisterNode } from './checkbox-tree-context'
import type { CheckboxTreeItemProps } from './checkbox-tree-types'
import { getIndentStyle } from './checkbox-tree-utils'

export const CheckboxTreeItem = forwardRef<HTMLDivElement, CheckboxTreeItemProps>(
  ({ className, id, label, disabled: disabledProp, ...props }, ref) => {
    const { disabled: rootDisabled, getNodeState, setNodeChecked } = useCheckboxTree()
    const { level } = useParent()

    useRegisterNode(id, true)

    const disabled = rootDisabled || disabledProp
    const isChecked = getNodeState(id) === 'checked'

    return (
      <Layout.Flex
        ref={ref}
        align="center"
        gap="sm"
        role="treeitem"
        aria-selected={isChecked}
        aria-checked={isChecked}
        className={cn('cn-checkbox-tree-row', className)}
        {...props}
      >
        <Checkbox
          aria-label={typeof label === 'string' ? label : id}
          checked={isChecked}
          disabled={disabled}
          onCheckedChange={value => setNodeChecked(id, value === true)}
        />
        <Text variant="body-normal" className={cn({ 'text-cn-disabled': disabled })} style={getIndentStyle(level)}>
          {label}
        </Text>
      </Layout.Flex>
    )
  }
)
CheckboxTreeItem.displayName = 'CheckboxTree.Item'
