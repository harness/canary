import * as React from 'react'
import { createContext, forwardRef, useCallback, useContext, useEffect, useState } from 'react'

import { IconV2, ScrollArea } from '@/components'
import * as AccordionPrimitive from '@radix-ui/react-accordion'
import { cn } from '@utils/cn'
import { ExecutionState } from '@views/repo/pull-request'

type ExecutionDetail = {
  status: ExecutionState
  /* formatted duration */
  duration?: string
}

const getStatusIcon = (status: ExecutionState): React.ReactElement => {
  switch (status) {
    case ExecutionState.RUNNING:
      return <IconV2 name="loader" className="animate-spin" color="warning" />
    case ExecutionState.SUCCESS:
      return <IconV2 name="check-circle-solid" color="success" />
    case ExecutionState.FAILURE:
      return <IconV2 name="xmark-circle-solid" color="danger" />
    case ExecutionState.WAITING_ON_DEPENDENCIES:
    case ExecutionState.PENDING:
    case ExecutionState.SKIPPED:
    case ExecutionState.UNKNOWN:
    default:
      return <IconV2 name="circle" color="neutral" />
  }
}

type TreeViewElement = {
  id: string
  name: string
  isSelectable?: boolean
  children?: TreeViewElement[]
} & ExecutionDetail

type TreeContextProps = {
  selectedId: string | undefined
  expendedItems: string[] | undefined
  indicator: boolean
  handleExpand: (id: string) => void
  selectItem: (id: string) => void
  setExpendedItems?: React.Dispatch<React.SetStateAction<string[] | undefined>>
  direction: 'rtl' | 'ltr'
}

const TreeContext = createContext<TreeContextProps | null>(null)

const useTree = () => {
  const context = useContext(TreeContext)
  if (!context) {
    throw new Error('useTree must be used within a TreeProvider')
  }
  return context
}

type Direction = 'rtl' | 'ltr' | undefined

type TreeViewProps = {
  initialSelectedId?: string
  indicator?: boolean
  elements?: TreeViewElement[]
  initialExpendedItems?: string[]
  openIcon?: React.ReactNode
  closeIcon?: React.ReactNode
} & React.HTMLAttributes<HTMLDivElement>

const Tree = forwardRef<HTMLDivElement, TreeViewProps>(
  ({ className, elements, initialSelectedId, initialExpendedItems, children, indicator = true, dir, ...props }) => {
    const [selectedId, setSelectedId] = useState<string | undefined>(initialSelectedId)
    const [expendedItems, setExpendedItems] = useState<string[] | undefined>(initialExpendedItems)

    const selectItem = useCallback((id: string) => {
      setSelectedId(id)
    }, [])

    const handleExpand = useCallback((id: string) => {
      setExpendedItems(prev => {
        if (prev?.includes(id)) {
          return prev.filter(item => item !== id)
        }
        return [...(prev ?? []), id]
      })
    }, [])

    const expandSpecificTargetedElements = useCallback((elements?: TreeViewElement[], selectId?: string) => {
      if (!elements || !selectId) return
      const findParent = (currentElement: TreeViewElement, currentPath: string[] = []) => {
        const isSelectable = currentElement.isSelectable ?? true
        const newPath = [...currentPath, currentElement.id]
        if (currentElement.id === selectId) {
          if (isSelectable) {
            setExpendedItems(prev => [...(prev ?? []), ...newPath])
          } else {
            if (newPath.includes(currentElement.id)) {
              newPath.pop()
              setExpendedItems(prev => [...(prev ?? []), ...newPath])
            }
          }
          return
        }
        if (isSelectable && currentElement.children && currentElement.children.length > 0) {
          currentElement.children.forEach(child => {
            findParent(child, newPath)
          })
        }
      }
      elements.forEach(element => {
        findParent(element)
      })
    }, [])

    useEffect(() => {
      if (initialSelectedId) {
        expandSpecificTargetedElements(elements, initialSelectedId)
        setSelectedId(initialSelectedId)
      }
    }, [initialSelectedId, elements])

    const direction = dir === 'rtl' ? 'rtl' : 'ltr'

    return (
      <TreeContext.Provider
        value={{
          selectedId,
          expendedItems,
          handleExpand,
          selectItem,
          setExpendedItems,
          indicator,
          direction
        }}
      >
        <ScrollArea className="pt-cn-md" direction={dir as Direction}>
          <div className={cn('size-full', className)}>
            <AccordionPrimitive.Root
              {...props}
              type="multiple"
              defaultValue={expendedItems}
              value={expendedItems}
              className="gap-cn-sm flex flex-col"
              onValueChange={value => setExpendedItems(prev => [...(prev ?? []), value[0]])}
              dir={dir as Direction}
            >
              {children}
            </AccordionPrimitive.Root>
          </div>
        </ScrollArea>
      </TreeContext.Provider>
    )
  }
)

Tree.displayName = 'Tree'

type FolderProps = {
  expendedItems?: string[]
  element: string
  isSelectable?: boolean
  isSelect?: boolean
  level: number
} & React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item> &
  ExecutionDetail

const Folder = forwardRef<HTMLDivElement, FolderProps & React.HTMLAttributes<HTMLDivElement>>(
  ({ className, element, value, isSelectable = true, isSelect, children, status, duration, level, ...props }) => {
    const { direction, handleExpand, expendedItems, setExpendedItems } = useTree()

    return (
      <AccordionPrimitive.Item
        {...props}
        value={value}
        className="pb-cn-sm -mb-cn-sm relative size-full overflow-hidden"
      >
        <AccordionPrimitive.Trigger
          className={cn(
            `flex w-full gap-cn-3xs rounded-cn-3 text-cn-size-2 px-cn-lg`,
            className,
            {
              'rounded-cn-3': isSelect && isSelectable,
              'cursor-pointer': isSelectable,
              'cursor-not-allowed opacity-50': !isSelectable
            },
            // TODO: Review and fix arbitrary values
            level >= 2 && 'pl-[56px]',
            level === 1 && 'pl-[28px]'
          )}
          disabled={!isSelectable}
          onClick={() => handleExpand(value)}
        >
          <IconV2
            name="nav-arrow-right"
            className={cn('text-cn-3 mt-cn-3xs', expendedItems?.includes(value) && 'rotate-90')}
            size="2xs"
          />
          <div className="gap-x-cn-xs flex w-full justify-between">
            <div className="gap-x-cn-xs flex">
              <div className="flex size-5 flex-none items-center justify-center">{getStatusIcon(status)}</div>
              <span className="text-cn-1 mt-cn-4xs text-left leading-tight">
                {element}&nbsp;<span className="text-cn-3">({React.Children.count(children)})</span>
              </span>
            </div>
            <span className="text-cn-2 flex-none">{duration ?? '--'}</span>
          </div>
        </AccordionPrimitive.Trigger>
        <AccordionPrimitive.Content className="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down px-cn-lg relative h-full overflow-visible text-cn-size-2">
          <AccordionPrimitive.Root
            dir={direction}
            type="multiple"
            className="mt-cn-sm rtl:mr-cn-lg gap-cn-sm flex flex-col"
            defaultValue={expendedItems}
            value={expendedItems}
            onValueChange={value => {
              setExpendedItems?.(prev => [...(prev ?? []), value[0]])
            }}
          >
            {children}
          </AccordionPrimitive.Root>
        </AccordionPrimitive.Content>
      </AccordionPrimitive.Item>
    )
  }
)

Folder.displayName = 'Folder'

const File = forwardRef<
  HTMLButtonElement,
  {
    value: string
    handleSelect?: (id: string) => void
    isSelectable?: boolean
    isSelect?: boolean
    fileIcon?: React.ReactNode
    level: number
  } & React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger> &
    ExecutionDetail
>(
  (
    {
      value,
      className,
      handleSelect,
      isSelectable = true,
      isSelect,
      // fileIcon,
      children,
      status,
      duration,
      level,
      ...props
    },
    ref
  ) => {
    const { direction, selectedId, selectItem } = useTree()
    const isSelected = isSelect ?? selectedId === value
    return (
      <AccordionPrimitive.Item value={value} className="relative w-full">
        <AccordionPrimitive.Trigger
          ref={ref}
          {...props}
          dir={direction}
          disabled={!isSelectable}
          aria-label="File"
          className={cn(
            'flex relative w-full cursor-pointer items-center gap-cn-3xs rounded-cn-3 text-cn-size-2 duration-200 ease-in-out rtl:pl-cn-3xs rtl:pr-0',
            {
              ['after:absolute after:bg-cn-hover after:-inset-x-cn-3xs after:-inset-y-cn-2xs after:-z-10 after:rounded']:
                isSelected
            },
            isSelectable ? 'cursor-pointer' : 'cursor-not-allowed opacity-50',
            // TODO: Review and fix arbitrary values
            level >= 2 && 'pl-[56px]',
            level === 1 && 'pl-[28px]',
            className
          )}
          onClick={() => {
            handleSelect?.(value)
            selectItem(value)
          }}
        >
          <div className="pl-cn-md gap-x-cn-xs relative flex w-full justify-between">
            <div className="gap-x-cn-xs flex">
              <div className="flex size-5 flex-none items-center justify-center">{getStatusIcon(status)}</div>
              <span className="text-cn-1 mt-cn-4xs text-left leading-tight">{children}</span>
            </div>
            <span className="text-cn-2 flex-none">{duration ?? '--'}</span>
          </div>
        </AccordionPrimitive.Trigger>
      </AccordionPrimitive.Item>
    )
  }
)

File.displayName = 'File'

const CollapseButton = forwardRef<
  HTMLButtonElement,
  {
    elements: TreeViewElement[]
    expandAll?: boolean
  } & React.HTMLAttributes<HTMLButtonElement>
>(
  (
    {
      // className,
      elements,
      expandAll = false,
      children,
      ...props
    },
    ref
  ) => {
    const { expendedItems, setExpendedItems } = useTree()

    const expendAllTree = useCallback((elements: TreeViewElement[]) => {
      const expandTree = (element: TreeViewElement) => {
        const isSelectable = element.isSelectable ?? true
        if (isSelectable && element.children && element.children.length > 0) {
          setExpendedItems?.(prev => [...(prev ?? []), element.id])
          element.children.forEach(expandTree)
        }
      }

      elements.forEach(expandTree)
    }, [])

    const closeAll = useCallback(() => {
      setExpendedItems?.([])
    }, [])

    useEffect(() => {
      if (expandAll) {
        expendAllTree(elements)
      }
    }, [expandAll])

    /**
     * @todo Replace this with Canary Button once the "@" issue gets resolved
     */
    return (
      <button
        // variant={'ghost'}
        className="p-cn-3xs bottom-cn-3xs right-cn-xs absolute h-8 w-fit"
        onClick={expendedItems && expendedItems.length > 0 ? closeAll : () => expendAllTree(elements)}
        ref={ref}
        {...props}
      >
        {children}
        <span className="sr-only">Toggle</span>
      </button>
    )
  }
)

CollapseButton.displayName = 'CollapseButton'

export { Tree, Folder, File, CollapseButton, type TreeViewElement }
