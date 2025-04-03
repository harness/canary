import * as React from 'react'
import { createContext, forwardRef, useCallback, useContext, useEffect, useState } from 'react'

import { Icon as CanaryIcon, ScrollArea } from '@/components'
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
      return <CanaryIcon size={20} name="running" className="animate-spin text-icons-warning" />
    case ExecutionState.SUCCESS:
      return <CanaryIcon name="success" size={16} className="text-icons-success" />
    case ExecutionState.FAILURE:
      return <CanaryIcon name="fail" className="text-icons-danger" size={16} />
    case ExecutionState.WAITING_ON_DEPENDENCIES:
    case ExecutionState.PENDING:
      return (
        <div className="flex size-5 items-center justify-center">
          <span className="size-4 rounded-full border border-icons-7" />
        </div>
      )
    case ExecutionState.SKIPPED:
    case ExecutionState.UNKNOWN:
    default:
      return <CanaryIcon name="circle" size={16} />
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
        <ScrollArea className="pt-4" dir={dir as Direction}>
          <div className={cn('size-full', className)}>
            <AccordionPrimitive.Root
              {...props}
              type="multiple"
              defaultValue={expendedItems}
              value={expendedItems}
              className="flex flex-col gap-3"
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

const TreeIndicator = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const { direction } = useTree()

    return (
      <div
        dir={direction}
        ref={ref}
        className={cn(
          'absolute left-1.5 h-full w-px rounded-md py-3 duration-300 ease-in-out hover:bg-slate-300 rtl:right-1.5',
          className
        )}
        {...props}
      />
    )
  }
)

TreeIndicator.displayName = 'TreeIndicator'

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
      <AccordionPrimitive.Item {...props} value={value} className="relative -mb-3 size-full overflow-hidden pb-3">
        <AccordionPrimitive.Trigger
          className={cn(
            `flex w-full gap-1 rounded-md text-sm px-5`,
            className,
            {
              'rounded-md': isSelect && isSelectable,
              'cursor-pointer': isSelectable,
              'cursor-not-allowed opacity-50': !isSelectable
            },
            level >= 2 && 'pl-14',
            level === 1 && 'pl-7'
          )}
          disabled={!isSelectable}
          onClick={() => handleExpand(value)}
        >
          <CanaryIcon
            name="chevron-right"
            className={cn('text-icons-1 mt-1', expendedItems?.includes(value) && 'rotate-90')}
            size={12}
          />
          <div className="flex w-full justify-between gap-x-2">
            <div className="flex gap-x-2">
              <div className="flex size-5 flex-none items-center justify-center">{getStatusIcon(status)}</div>
              <span className="mt-0.5 text-left leading-tight text-cn-foreground-1">
                {element}&nbsp;<span className="text-cn-foreground-3">({React.Children.count(children)})</span>
              </span>
            </div>
            <span className="flex-none text-cn-foreground-2">{duration ?? '--'}</span>
          </div>
        </AccordionPrimitive.Trigger>
        <AccordionPrimitive.Content className="relative h-full overflow-visible px-5 text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
          <AccordionPrimitive.Root
            dir={direction}
            type="multiple"
            className="mt-3 flex flex-col gap-3 rtl:mr-5"
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
            'flex relative w-full cursor-pointer items-center gap-1 rounded-md text-sm duration-200 ease-in-out rtl:pl-1 rtl:pr-0',
            {
              ['after:absolute after:bg-cn-background-hover after:-inset-x-1 after:-inset-y-1.5 after:-z-10 after:rounded']:
                isSelected
            },
            isSelectable ? 'cursor-pointer' : 'cursor-not-allowed opacity-50',
            level >= 2 && 'pl-14',
            level === 1 && 'pl-7',
            className
          )}
          onClick={() => {
            handleSelect?.(value)
            selectItem(value)
          }}
        >
          <div className="relative flex w-full justify-between gap-x-2 pl-4">
            <div className="flex gap-x-2">
              <div className="flex size-5 flex-none items-center justify-center">{getStatusIcon(status)}</div>
              <span className="mt-0.5 text-left leading-tight text-cn-foreground-1">{children}</span>
            </div>
            <span className="flex-none text-cn-foreground-2">{duration ?? '--'}</span>
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
        className="absolute bottom-1 right-2 h-8 w-fit p-1"
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
