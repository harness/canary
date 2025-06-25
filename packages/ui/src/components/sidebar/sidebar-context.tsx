import { ComponentProps, createContext, forwardRef, useCallback, useContext, useEffect, useMemo, useState } from 'react'

import { TooltipProvider } from '@/components'
import { cn } from '@utils/cn'

import {
  SIDEBAR_COLLAPSED_WIDTH,
  SIDEBAR_COOKIE_MAX_AGE,
  SIDEBAR_COOKIE_NAME,
  SIDEBAR_KEYBOARD_SHORTCUT,
  SIDEBAR_WIDTH
} from './sidebar-constants'
import { useIsMobile } from './use-is-mobile'

type SidebarContextType = {
  state: 'expanded' | 'collapsed'
  setOpen: (open: boolean) => void
  openMobile: boolean
  setOpenMobile: (open: boolean) => void
  isMobile: boolean
  toggleSidebar: () => void
}

const SidebarContext = createContext<SidebarContextType | null>(null)

export type UseSidebarSignature = () => SidebarContextType

export function useSidebar() {
  const context = useContext(SidebarContext)
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider.')
  }

  return context
}

export const SidebarProvider = forwardRef<
  HTMLDivElement,
  ComponentProps<'div'> & { defaultOpen?: boolean; open?: boolean; onOpenChange?: (open: boolean) => void }
>(({ defaultOpen = true, open: openProp, onOpenChange: setOpenProp, className, children, ...props }, ref) => {
  const isMobile = useIsMobile()
  const [openMobile, setOpenMobile] = useState(false)

  // This is the internal state of the sidebar.
  // We use openProp and setOpenProp for control from outside the component.
  const [_open, _setOpen] = useState(defaultOpen)
  const open = openProp ?? _open
  const setOpen = useCallback(
    (value: boolean | ((value: boolean) => boolean)) => {
      const openState = typeof value === 'function' ? value(open) : value
      if (setOpenProp) {
        setOpenProp(openState)
      } else {
        _setOpen(openState)
      }

      // This sets the cookie to keep the sidebar state.
      document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`
    },
    [setOpenProp, open]
  )

  // Helper to toggle the sidebar.
  const toggleSidebar = useCallback(() => {
    return isMobile ? setOpenMobile(open => !open) : setOpen(open => !open)
  }, [isMobile, setOpen, setOpenMobile])

  // Adds a keyboard shortcut to toggle the sidebar.
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === SIDEBAR_KEYBOARD_SHORTCUT && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        toggleSidebar()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [toggleSidebar])

  // We add a state so that we can do data-state="expanded" or "collapsed".
  // This makes it easier to style the sidebar with Tailwind classes.
  const state = open ? 'expanded' : 'collapsed'

  const contextValue = useMemo<SidebarContextType>(
    () => ({ state, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar }),
    [state, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar]
  )

  useEffect(() => {
    if (isMobile) return

    if (open) {
      document.body.style.setProperty('--cn-sidebar-width', SIDEBAR_WIDTH)
    } else {
      document.body.style.setProperty('--cn-sidebar-width', SIDEBAR_COLLAPSED_WIDTH)
    }

    return () => {
      document.body.style.removeProperty('--cn-sidebar-width')
    }
  }, [open, isMobile])

  return (
    <SidebarContext.Provider value={contextValue}>
      <TooltipProvider delayDuration={0}>
        <div className={cn('cn-sidebar-wrapper', className)} ref={ref} {...props}>
          {children}
        </div>
      </TooltipProvider>
    </SidebarContext.Provider>
  )
})
SidebarProvider.displayName = 'SidebarProvider'
