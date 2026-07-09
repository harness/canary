import { forwardRef } from 'react'

import { Checkbox, IconV2, Layout, Text } from '@/components'
import * as AccordionPrimitive from '@radix-ui/react-accordion'
import { cn } from '@utils/cn'

import { ParentProvider, useCheckboxTree, useParent, useRegisterNode } from './checkbox-tree-context'
import type { CheckboxTreeGroupProps } from './checkbox-tree-types'
import { getIndentStyle, toCheckboxValue } from './checkbox-tree-utils'

export const CheckboxTreeGroup = forwardRef<HTMLDivElement, CheckboxTreeGroupProps>(
  ({ className, id, label, disabled: disabledProp, icon = 'folder', children, ...props }, ref) => {
    const {
      disabled: rootDisabled,
      showCount,
      expandedIds,
      getNodeState,
      getLeafCount,
      setNodeChecked
    } = useCheckboxTree()
    const { level } = useParent()

    useRegisterNode(id, false)

    const disabled = rootDisabled || disabledProp
    const state = getNodeState(id)
    const isExpanded = expandedIds.includes(id)
    const count = showCount ? getLeafCount(id) : 0

    return (
      <AccordionPrimitive.Item ref={ref} value={id} className="cn-checkbox-tree-item" {...props}>
        <Layout.Flex
          align="center"
          gap="sm"
          className={cn('cn-checkbox-tree-row', className)}
          role="treeitem"
          aria-expanded={isExpanded}
          aria-selected={state === 'checked'}
        >
          <Checkbox
            aria-label={typeof label === 'string' ? label : id}
            checked={toCheckboxValue(state)}
            disabled={disabled}
            onCheckedChange={value => setNodeChecked(id, value === true)}
          />
          <AccordionPrimitive.Trigger
            disabled={disabled}
            className="cn-checkbox-tree-trigger"
            style={getIndentStyle(level)}
          >
            <Layout.Flex align="center" gap="xs">
              <IconV2 name="nav-arrow-right" size="2xs" className={cn('shrink-0', isExpanded && 'rotate-90')} />
              <IconV2 name={icon} size="sm" className="shrink-0" />
              <Text variant="heading-small">
                {label}
                {count > 0 && <span className="text-cn-3">&nbsp;({count})</span>}
              </Text>
            </Layout.Flex>
          </AccordionPrimitive.Trigger>
        </Layout.Flex>
        {/*
         * `forceMount` keeps descendants mounted while collapsed so they stay in the
         * selection registry (otherwise a collapsed group loses its children and every
         * ancestor — including Select All — would render as unchecked). Visibility is
         * handled via CSS on `[data-state=closed]`.
         */}
        <AccordionPrimitive.Content className="cn-checkbox-tree-content" role="group" forceMount>
          <ParentProvider value={{ parentId: id, level: level + 1 }}>{children}</ParentProvider>
        </AccordionPrimitive.Content>
      </AccordionPrimitive.Item>
    )
  }
)
CheckboxTreeGroup.displayName = 'CheckboxTree.Group'
