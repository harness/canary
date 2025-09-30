import {
  Children,
  ComponentType,
  createContext,
  forwardRef,
  HTMLAttributes,
  MouseEvent,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react'

import { Slot } from '@radix-ui/react-slot'

interface FocusEntry {
  triggerId: string
  triggerElement: HTMLElement
}

interface DialogFocusContextValue {
  registerTrigger: (entry: FocusEntry) => void
  unregisterTrigger: (id: string) => void
  restoreFocus: (id: string) => void
  getLastTrigger: () => FocusEntry | undefined
}

const DialogContext = createContext<DialogFocusContextValue | undefined>(undefined)

const useDialogFocusManager = () => {
  const context = useContext(DialogContext)

  return context
}

/**
 * DialogProvider component manages focus for dialog triggers.
 * It ensures that the last focused element is restored when the dialog is closed.
 */
const DialogProvider = ({ children }: { children: ReactNode }) => {
  const focusStack = useRef<FocusEntry[]>([])

  const unregisterTrigger = useCallback((id: string) => {
    focusStack.current = focusStack.current.filter(e => e.triggerId !== id)
  }, [])

  const registerTrigger = useCallback((entry: FocusEntry) => {
    unregisterTrigger(entry.triggerId)
    focusStack.current.push(entry)
  }, [])

  const restoreFocus = useCallback((id: string) => {
    const entryIndex = focusStack.current.findIndex(e => e.triggerId === id)

    if (entryIndex !== -1) {
      const entry = focusStack.current[entryIndex]
      if (entry.triggerElement) {
        setTimeout(() => entry.triggerElement.focus(), 0)
      }
      unregisterTrigger(entry.triggerId)
    } else {
      const lastEntry = focusStack.current.at(-1)
      if (lastEntry?.triggerElement) {
        setTimeout(() => lastEntry.triggerElement.focus(), 0)
      }
    }
  }, [])

  const getLastTrigger = useCallback(() => {
    return focusStack.current.at(-1)
  }, [])

  return (
    <DialogContext.Provider value={{ registerTrigger, unregisterTrigger, restoreFocus, getLastTrigger }}>
      {children}
    </DialogContext.Provider>
  )
}

let triggerCounter = 0

const useTriggerId = (_id?: string) => {
  const id = useRef(`${_id || 'dialog-trigger'}-${triggerCounter++}`)
  return id.current
}

/**
 * Custom hook to manage dialog trigger elements.
 * It provides a ref for the trigger element and a callback to register the trigger.
 * Useful when a dialog is opened from a complex components like dropdowns, etc.
 */
const useCustomDialogTrigger = () => {
  const focusManager = useDialogFocusManager()
  const triggerId = useTriggerId()
  const triggerRef = useRef<HTMLButtonElement>(null)

  const registerTrigger = useCallback(() => {
    if (focusManager && triggerRef.current) {
      focusManager.registerTrigger({ triggerId, triggerElement: triggerRef.current })
    }
  }, [focusManager, triggerId])

  return { triggerRef, registerTrigger }
}

interface DialogOpenContextValue {
  open?: boolean
}

const DialogOpenContext = createContext<DialogOpenContextValue | undefined>(undefined)
const useDialogOpenContext = () => {
  const context = useContext(DialogOpenContext)
  if (!context) {
    throw new Error('useDialogOpenContext must be used within a DialogProvider')
  }
  return context
}

const useRegisterDialog = () => {
  const focusManager = useDialogFocusManager()
  const [triggerId, setTriggerId] = useState<string>('')
  const { open } = useDialogOpenContext()

  const handleCloseAutoFocus = useCallback(() => {
    if (focusManager) {
      focusManager.restoreFocus(triggerId)
    }
  }, [focusManager, triggerId])

  useEffect(() => {
    if (focusManager && open) {
      const triggerId = focusManager.getLastTrigger()?.triggerId
      if (!triggerId) return
      setTriggerId(triggerId)
    }
  }, [open])

  useEffect(() => {
    return () => {
      if (focusManager) {
        focusManager.unregisterTrigger(triggerId)
      }
    }
  }, [])

  return { handleCloseAutoFocus }
}

/**
 * Dialog trigger component is essential for opening dialogs.
 * It registers the trigger element with the dialog focus manager.
 */
const TriggerBase = forwardRef<
  HTMLButtonElement,
  HTMLAttributes<HTMLDivElement> & { children: ReactNode; TriggerComponent: ComponentType<{ asChild?: boolean }> }
>(({ onClick, id, children, TriggerComponent, ...props }, ref) => {
  const triggerId = useTriggerId(id)
  const focusManager = useDialogFocusManager()

  const dialogContext = useContext(DialogOpenContext)
  const isInsideDialog = dialogContext !== undefined
  const childrenCount = Children.count(children)

  if (childrenCount > 1) {
    console.warn('Dialog.Trigger: Only one child is allowed')
    children = <span>{children}</span>
  }

  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    if (focusManager) {
      focusManager.registerTrigger({ triggerId, triggerElement: event.currentTarget })
    }
    onClick?.(event)
  }

  const trigger = (
    <Slot ref={ref} onClick={handleClick} {...props} id={triggerId}>
      {children}
    </Slot>
  )

  if (isInsideDialog && !onClick) {
    return <TriggerComponent asChild>{trigger}</TriggerComponent>
  }

  return trigger
})
TriggerBase.displayName = 'DialogTriggerBase'

export { DialogProvider, useCustomDialogTrigger, useRegisterDialog, DialogOpenContext, TriggerBase }
