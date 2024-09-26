import { ScrollArea } from '@radix-ui/react-scroll-area'
import { cn } from '../lib/utils'
import * as AccordionPrimitive from '@radix-ui/react-accordion'
import { NavArrowRight, NavArrowDown, Circle, CheckCircleSolid, XmarkCircleSolid } from '@harnessio/icons-noir'
import React, { createContext, forwardRef, useCallback, useContext, useEffect, useState } from 'react'

enum Status {
  QUEUED,
  IN_PROGRESS,
  SUCCESS,
  FAILED,
  SKIPPED,
  UNKNOWN
}

type ExecutionDetail = {
  status: Status
  /* formatted duration */
  duration?: string
}

const getStatusIcon = (status: Status): React.ReactElement => {
  switch (status) {
    case Status.QUEUED:
      return <Circle size="16" />
    case Status.IN_PROGRESS:
      return <Circle size="16" />
    case Status.SUCCESS:
      return <CheckCircleSolid color="#63E9A6" size="16" />
    case Status.FAILED:
      return <XmarkCircleSolid color="#db6662" size="16" />
    case Status.SKIPPED:
      return <Circle size="16" />
    case Status.UNKNOWN:
    default:
      return <></>
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
  openIcon?: React.ReactNode
  closeIcon?: React.ReactNode
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
  (
    {
      className,
      elements,
      initialSelectedId,
      initialExpendedItems,
      children,
      indicator = true,
      openIcon,
      closeIcon,
      dir,
      ...props
    },
    ref
  ) => {
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
          openIcon,
          closeIcon,
          direction
        }}>
        <div className={cn('size-full', className)}>
          <ScrollArea ref={ref} className="h-full relative px-2" dir={dir as Direction}>
            <AccordionPrimitive.Root
              {...props}
              type="multiple"
              defaultValue={expendedItems}
              value={expendedItems}
              className="flex flex-col gap-1"
              onValueChange={value => setExpendedItems(prev => [...(prev ?? []), value[0]])}
              dir={dir as Direction}>
              {children}
            </AccordionPrimitive.Root>
          </ScrollArea>
        </div>
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
          'h-full w-px absolute left-1.5 rtl:right-1.5 py-3 rounded-md hover:bg-slate-300 duration-300 ease-in-out',
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
} & React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item> &
  ExecutionDetail

const Folder = forwardRef<HTMLDivElement, FolderProps & React.HTMLAttributes<HTMLDivElement>>(
  ({ className, element, value, isSelectable = true, isSelect, children, status, duration, ...props }) => {
    const { direction, handleExpand, expendedItems, indicator, setExpendedItems, openIcon, closeIcon } = useTree()

    return (
      <AccordionPrimitive.Item {...props} value={value} className="relative overflow-hidden h-full w-full">
        <AccordionPrimitive.Trigger
          className={cn(`flex items-center gap-1 text-sm rounded-md w-full pb-1.5`, className, {
            'rounded-md': isSelect && isSelectable,
            'cursor-pointer': isSelectable,
            'cursor-not-allowed opacity-50': !isSelectable
          })}
          disabled={!isSelectable}
          onClick={() => handleExpand(value)}>
          {expendedItems?.includes(value)
            ? (openIcon ?? <NavArrowDown className="h-4 w-4" size="12" />)
            : (closeIcon ?? <NavArrowRight className="h-4 w-4" size="12" />)}
          <div className="flex items-baseline justify-between w-full mt-1 mr-1">
            <div className="flex items-baseline">
              <div className="flex self-center mr-1">{getStatusIcon(status)}</div>
              <span className="ml-1 font-normal text-sm">
                {element}&nbsp;<span className="text-[#787887]">({React.Children.count(children)})</span>
              </span>
            </div>
            <span className="text-[#93939F]">{duration ?? '--'}</span>
          </div>
        </AccordionPrimitive.Trigger>
        <AccordionPrimitive.Content className="text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down relative overflow-hidden h-full">
          {element && indicator && <TreeIndicator aria-hidden="true" />}
          <AccordionPrimitive.Root
            dir={direction}
            type="multiple"
            className="flex flex-col gap-1 pl-5 rtl:mr-5"
            defaultValue={expendedItems}
            value={expendedItems}
            onValueChange={value => {
              setExpendedItems?.(prev => [...(prev ?? []), value[0]])
            }}>
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
            'flex items-center gap-1 cursor-pointer text-sm px-1 rtl:pl-1 rtl:pr-0 rounded-md duration-200 ease-in-out w-full py-1',
            { ['bg-[#18181B] px-2']: isSelected },
            isSelectable ? 'cursor-pointer' : 'opacity-50 cursor-not-allowed',
            className
          )}
          onClick={() => {
            handleSelect?.(value)
            selectItem(value)
          }}>
          <div className="flex items-baseline justify-between w-full">
            <div className="flex items-baseline">
              <div className="flex self-center h-4 w-4 mr-1">{getStatusIcon(status)}</div>
              <span className="ml-1 font-normal text-sm">{children}</span>
            </div>
            <span className="text-[#93939F]">{duration ?? '--'}</span>
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
      console.log(expandAll)
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
        className="h-8 w-fit p-1 absolute bottom-1 right-2"
        onClick={expendedItems && expendedItems.length > 0 ? closeAll : () => expendAllTree(elements)}
        ref={ref}
        {...props}>
        {children}
        <span className="sr-only">Toggle</span>
      </button>
    )
  }
)

CollapseButton.displayName = 'CollapseButton'

export { Status, Tree, Folder, File, CollapseButton, type TreeViewElement }
