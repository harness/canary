import { ComponentProps, useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { DialogOpenContext, usePortal } from '@/context'
import { Drawer as DrawerPrimitive } from 'vaul'
import styleText from 'vaul/style.css?raw'

import { DEFAULT_MAX_STACK_DEPTH, DrawerContext, getMaxDrawerSize, useDrawerContext } from './drawer-context'

export const DrawerRoot = ({
  direction = 'right',
  open,
  children,
  onOpenChange,
  maxStackDepth: maxStackDepthProp,
  ...props
}: ComponentProps<typeof DrawerPrimitive.Root> & { maxStackDepth?: number }) => {
  const { portalContainer } = usePortal()
  const [childDrawerOpen, setChildDrawerOpen] = useState(false)
  const [maxDescendantSize, setMaxDescendantSize] = useState<string | undefined>(undefined)
  const [contentSize, setContentSize] = useState<string | undefined>(undefined)
  const [openDescendantCount, setOpenDescendantCount] = useState(0)
  // track actual drawer state from Vaul (required for trigger mode)
  const [internalOpen, setInternalOpen] = useState(false)
  const {
    isParentOpen,
    onChildOpenChange,
    onChildSubtreeMax,
    onChildDescendantCount,
    stackDepth: parentStackDepth,
    maxStackDepth: inheritedMaxStackDepth
  } = useDrawerContext()
  const nested = isParentOpen
  const maxStackDepth = maxStackDepthProp ?? inheritedMaxStackDepth ?? DEFAULT_MAX_STACK_DEPTH
  const stackDepth = nested ? (parentStackDepth ?? 0) + 1 : 0

  useEffect(() => {
    if (!portalContainer || portalContainer.querySelector('#vaul-style')) return

    const style = document.createElement('style')
    style.setAttribute('id', 'vaul-style')
    style.textContent = styleText

    portalContainer?.appendChild(style)
  }, [portalContainer])

  // Callback for child drawers to notify this drawer
  const handleChildOpenChange = useCallback((isOpen: boolean) => {
    setChildDrawerOpen(isOpen)
    if (!isOpen) {
      setMaxDescendantSize(undefined)
      setOpenDescendantCount(0)
    }
  }, [])

  // Child reports the max size of itself + all its descendants
  const handleChildSubtreeMax = useCallback(
    (childMax: string | undefined) => {
      setMaxDescendantSize(childMax)
      // Bubble up: tell our parent the max of our own content + all descendants
      if (nested && onChildSubtreeMax) {
        onChildSubtreeMax(getMaxDrawerSize(contentSize, childMax))
      }
    },
    [nested, onChildSubtreeMax, contentSize]
  )

  const handleChildDescendantCount = useCallback(
    (childCount: number) => {
      const totalCount = childCount + 1
      setOpenDescendantCount(totalCount)
      if (nested && onChildDescendantCount) {
        onChildDescendantCount(totalCount)
      }
    },
    [nested, onChildDescendantCount]
  )

  const maxDescendantSizeRef = useRef(maxDescendantSize)
  useEffect(() => {
    maxDescendantSizeRef.current = maxDescendantSize
  }, [maxDescendantSize])

  const handleContentSizeReport = useCallback(
    (size: string) => {
      setContentSize(size)
      if (nested && onChildSubtreeMax) {
        onChildSubtreeMax(getMaxDrawerSize(size, maxDescendantSizeRef.current))
      }
    },
    [nested, onChildSubtreeMax]
  )

  // Track controlled `open` prop changes and notify parent
  useEffect(() => {
    // When controlled `open` prop changes, we need to notify parent
    // (wrappedOnOpenChange won't be called by Vaul in this case)
    if (open !== undefined && nested && onChildOpenChange) {
      onChildOpenChange(open)
    }
  }, [open, nested, onChildOpenChange])

  // Report initial descendant count (0 = just this drawer) when opened
  useEffect(() => {
    const isOpen = open ?? internalOpen
    if (isOpen && nested && onChildDescendantCount) {
      onChildDescendantCount(openDescendantCount)
    }
  }, [open, internalOpen, nested, onChildDescendantCount, openDescendantCount])

  // Wrap user's onOpenChange to intercept all state changes (controlled and trigger mode)
  const wrappedOnOpenChange = useCallback(
    (isOpen: boolean) => {
      setInternalOpen(isOpen)

      // Notify parent drawer that our state changed
      if (nested && onChildOpenChange) {
        onChildOpenChange(isOpen)
      }

      // Call user's original callback
      onOpenChange?.(isOpen)
    },
    [nested, onChildOpenChange, onOpenChange]
  )

  const RootComponent = nested ? DrawerPrimitive.NestedRoot : DrawerPrimitive.Root

  const rootProps = useMemo(
    () => ({
      direction,
      open,
      ...props,
      onOpenChange: wrappedOnOpenChange
    }),
    [direction, open, props, wrappedOnOpenChange]
  )

  const contextValue = useMemo(
    () => ({
      direction,
      nested,
      // Use all three: parent state + controlled prop + trigger state
      isParentOpen: isParentOpen || open || internalOpen,
      hasOpenChild: childDrawerOpen,
      onChildOpenChange: handleChildOpenChange,
      maxDescendantSize,
      onChildSubtreeMax: handleChildSubtreeMax,
      reportContentSize: handleContentSizeReport,
      openDescendantCount,
      onChildDescendantCount: handleChildDescendantCount,
      modal: props?.modal ?? true,
      stackDepth,
      maxStackDepth
    }),
    [
      direction,
      nested,
      isParentOpen,
      open,
      internalOpen,
      childDrawerOpen,
      handleChildOpenChange,
      maxDescendantSize,
      handleChildSubtreeMax,
      handleContentSizeReport,
      openDescendantCount,
      handleChildDescendantCount,
      props?.modal,
      stackDepth,
      maxStackDepth
    ]
  )

  return (
    <DrawerContext.Provider value={contextValue}>
      <DialogOpenContext.Provider value={{ open: open ?? internalOpen }}>
        <RootComponent handleOnly {...rootProps} container={portalContainer as HTMLElement} data-root="drawer">
          {children}
        </RootComponent>
      </DialogOpenContext.Provider>
    </DrawerContext.Provider>
  )
}
DrawerRoot.displayName = 'DrawerRoot'
