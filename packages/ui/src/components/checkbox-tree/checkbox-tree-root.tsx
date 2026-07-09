import { forwardRef, useState } from 'react'

import { Checkbox, Layout, ScrollArea } from '@/components'
import * as AccordionPrimitive from '@radix-ui/react-accordion'
import { cn } from '@utils/cn'

import { CheckboxTreeProvider, ParentProvider, useCheckboxTreeSelection } from './checkbox-tree-context'
import type { CheckboxTreeRootProps } from './checkbox-tree-types'
import { toCheckboxValue } from './checkbox-tree-utils'

export const CheckboxTreeRoot = forwardRef<HTMLDivElement, CheckboxTreeRootProps>(
  (
    {
      className,
      children,
      selectedIds,
      onSelectionChange,
      defaultExpandedIds,
      showSelectAll = false,
      selectAllLabel = 'Select All',
      showCount = false,
      disabled,
      ...props
    },
    ref
  ) => {
    const [expandedIds, setExpandedIds] = useState<string[]>(defaultExpandedIds ?? [])
    const selection = useCheckboxTreeSelection({ selectedIds, onSelectionChange })
    const rootState = selection.getRootState()

    return (
      <CheckboxTreeProvider value={{ disabled, showCount, expandedIds, setExpandedIds, ...selection }}>
        <ParentProvider value={{ parentId: undefined, level: 0 }}>
          <ScrollArea>
            <div ref={ref} role="tree" className={cn('cn-checkbox-tree', className)} {...props}>
              {showSelectAll && (
                <Layout.Flex align="center" gap="sm" className="cn-checkbox-tree-row">
                  <Checkbox
                    aria-label={selectAllLabel}
                    checked={toCheckboxValue(rootState)}
                    disabled={disabled}
                    onCheckedChange={value => selection.setAllChecked(value === true)}
                  />
                  <span className="cn-checkbox-tree-label cn-checkbox-tree-select-all">{selectAllLabel}</span>
                </Layout.Flex>
              )}
              <AccordionPrimitive.Root
                type="multiple"
                value={expandedIds}
                onValueChange={setExpandedIds}
                className="contents"
              >
                {children}
              </AccordionPrimitive.Root>
            </div>
          </ScrollArea>
        </ParentProvider>
      </CheckboxTreeProvider>
    )
  }
)

CheckboxTreeRoot.displayName = 'CheckboxTree.Root'
