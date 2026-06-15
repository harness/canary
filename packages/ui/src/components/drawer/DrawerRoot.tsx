import { ComponentProps, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'

import { DialogOpenContext, usePortal } from '@/context'
import { Drawer as DrawerPrimitive } from 'vaul'
import styleText from 'vaul/style.css?raw'

import { DEFAULT_MAX_STACK_DEPTH, DrawerContext, useDrawerContext } from './drawer-context'

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
  const [topmostDescendantSize, setTopmostDescendantSize] = useState<string | undefined>(undefined)
  const [contentSize, setContentSize] = useState<string | undefined>(undefined)
  const [openDescendantCount, setOpenDescendantCount] = useState(0)
  // track actual drawer state from Vaul (required for trigger mode)
  const [internalOpen, setInternalOpen] = useState(false)
  const {
    isParentOpen,
    onChildOpenChange,
    onTopmostSizeChange: parentOnTopmostSizeChange,
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
  const handleChildOpenChange = useCallback(
    (isOpen: boolean) => {
      setChildDrawerOpen(isOpen)
      if (!isOpen) {
        setTopmostDescendantSize(undefined)
        setOpenDescendantCount(0)
        if (nested && parentOnTopmostSizeChange && contentSize) {
          parentOnTopmostSizeChange(contentSize)
        }
        if (nested && onChildDescendantCount) {
          onChildDescendantCount(0)
        }
      }
    },
    [nested, parentOnTopmostSizeChange, contentSize, onChildDescendantCount]
  )

  // Topmost (frontmost) descendant size — passed through unchanged
  const handleTopmostSizeChange = useCallback(
    (size: string | undefined) => {
      setTopmostDescendantSize(size)
      if (nested && parentOnTopmostSizeChange) {
        parentOnTopmostSizeChange(size)
      }
    },
    [nested, parentOnTopmostSizeChange]
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

  const contentSizeRef = useRef(contentSize)
  useEffect(() => {
    contentSizeRef.current = contentSize
  }, [contentSize])

  // Track open state synchronously for use in callbacks during the same event
  const isOpenRef = useRef(open ?? internalOpen)

  const handleContentSizeReport = useCallback(
    (size: string) => {
      setContentSize(size)
      contentSizeRef.current = size
      // Propagate immediately if this drawer is open and nested — ensures the
      // parent receives topmostDescendantSize in the same commit as hasOpenChild.
      if (isOpenRef.current && nested && parentOnTopmostSizeChange) {
        parentOnTopmostSizeChange(size)
      }
    },
    [nested, parentOnTopmostSizeChange]
  )

  // Track controlled `open` prop changes and notify parent.
  // Uses useLayoutEffect so that hasOpenChild + topmostDescendantSize arrive in the same
  // synchronous commit as DrawerContent's size report — prevents a one-frame flicker where
  // the parent sees the size change but not the open state (or vice-versa).
  useLayoutEffect(() => {
    if (open !== undefined) {
      isOpenRef.current = open
      if (nested && onChildOpenChange) {
        onChildOpenChange(open)
      }
      if (open && nested && parentOnTopmostSizeChange && contentSizeRef.current) {
        parentOnTopmostSizeChange(contentSizeRef.current)
      }
    }
  }, [open, nested, onChildOpenChange, parentOnTopmostSizeChange])

  // Report descendant count when this drawer first opens (initial notification to parent)
  const prevOpen = useRef(open ?? internalOpen)
  useLayoutEffect(() => {
    const isOpen = open ?? internalOpen
    const justOpened = isOpen && !prevOpen.current
    prevOpen.current = isOpen
    if (justOpened && nested && onChildDescendantCount) {
      onChildDescendantCount(openDescendantCount)
    }
  }, [open, internalOpen, nested, onChildDescendantCount, openDescendantCount])

  // Wrap user's onOpenChange to intercept all state changes (controlled and trigger mode)
  const wrappedOnOpenChange = useCallback(
    (isOpen: boolean) => {
      setInternalOpen(isOpen)
      isOpenRef.current = isOpen

      // Notify parent drawer that our state changed
      if (nested && onChildOpenChange) {
        onChildOpenChange(isOpen)
      }

      // Propagate topmost size when opening (same batch as onChildOpenChange so
      // the parent receives hasOpenChild + topmostDescendantSize together)
      if (isOpen && nested && parentOnTopmostSizeChange && contentSizeRef.current) {
        parentOnTopmostSizeChange(contentSizeRef.current)
      }

      // Call user's original callback
      onOpenChange?.(isOpen)
    },
    [nested, onChildOpenChange, parentOnTopmostSizeChange, onOpenChange]
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
      isParentOpen: isParentOpen || open || internalOpen,
      hasOpenChild: childDrawerOpen,
      onChildOpenChange: handleChildOpenChange,
      topmostDescendantSize,
      onTopmostSizeChange: handleTopmostSizeChange,
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
      topmostDescendantSize,
      handleTopmostSizeChange,
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
