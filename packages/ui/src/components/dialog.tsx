import {
  Children,
  createContext,
  forwardRef,
  HTMLAttributes,
  isValidElement,
  MouseEvent,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react'

import { usePortal, useTranslation } from '@/context'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { cn } from '@utils/cn'
import { cva, type VariantProps } from 'class-variance-authority'

import { Button, ButtonProps } from './button'
import { IconV2, IconV2NamesType } from './icon-v2'
import { LogoV2, LogoV2NamesType } from './logo-v2'
import { ScrollArea } from './scroll-area'

const contentVariants = cva('cn-modal-dialog-content', {
  variants: {
    size: {
      sm: 'cn-modal-dialog-sm',
      md: 'cn-modal-dialog-md',
      lg: 'cn-modal-dialog-lg'
    }
  },
  defaultVariants: {
    size: 'sm'
  }
})

const headerVariants = cva('cn-modal-dialog-header', {
  variants: {
    theme: {
      default: 'cn-modal-dialog-theme-default',
      warning: 'cn-modal-dialog-theme-warning',
      danger: 'cn-modal-dialog-theme-danger'
    }
  },
  defaultVariants: {
    theme: 'default'
  }
})

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

const DialogProvider = ({ children }: { children: ReactNode }) => {
  const focusStack = useRef<FocusEntry[]>([])

  const unregisterTrigger = useCallback((id: string) => {
    focusStack.current = focusStack.current.filter(e => e.triggerId !== id)
    console.log('🚀 ~ unregisterTrigger ~ focusStack.current:', focusStack.current)
  }, [])

  const registerTrigger = useCallback((entry: FocusEntry) => {
    unregisterTrigger(entry.triggerId)
    console.log('🚀 ~ registerTrigger ~ entry.triggerId:', entry.triggerId)
    focusStack.current.push(entry)
    console.log('🚀 ~ registerTrigger ~ focusStack.current:', focusStack.current)
  }, [])

  const restoreFocus = useCallback((id: string) => {
    console.log('🚀 ~ restoreFocus ~ focusStack.current:', focusStack.current)
    const entryIndex = focusStack.current.findIndex(e => e.triggerId === id)

    if (entryIndex !== -1) {
      const entry = focusStack.current[entryIndex]
      console.log('🚀 ~ restoreFocus ~ entry:', entry)
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

export type ModalDialogRootProps = Pick<DialogPrimitive.DialogProps, 'open' | 'onOpenChange' | 'children'>

interface DialogOpenContextValue {
  open?: boolean
}

const DialogOpenContext = createContext<DialogOpenContextValue | undefined>(undefined)
const useDialogOpen = () => {
  const context = useContext(DialogOpenContext)
  if (!context) {
    throw new Error('useDialogOpen must be used within a DialogOpenProvider')
  }
  return context
}

const Root = ({ children, open, ...props }: ModalDialogRootProps) => {
  return (
    <DialogOpenContext.Provider value={{ open }}>
      <DialogPrimitive.Root {...props} open={open}>
        {children}
      </DialogPrimitive.Root>
    </DialogOpenContext.Provider>
  )
}

interface ContentProps extends DialogPrimitive.DialogContentProps, VariantProps<typeof contentVariants> {
  size?: 'sm' | 'md' | 'lg'
  hideClose?: boolean
}

const Content = forwardRef<HTMLDivElement, ContentProps>(
  ({ children, className, size = 'sm', hideClose = false, ...props }, ref) => {
    const { portalContainer } = usePortal()
    const focusManager = useDialogFocusManager()
    const [triggerId, setTriggerId] = useState<string>('')
    const { open } = useDialogOpen()

    const handleCloseAutoFocus = useCallback(() => {
      console.log('🚀 ~ triggerId:', triggerId)
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
        console.log('🚀 ~ return ():', focusManager)
        if (focusManager) {
          focusManager.unregisterTrigger(triggerId)
        }
      }
    }, [])

    return (
      <DialogPrimitive.Portal container={portalContainer}>
        {/* !!! */}
        {/* For the scroll to work when using the dialog in Shadow DOM, the Overlay needs to wrap the Content */}
        {/* Here’s the issue for the scroll bug in Shadow DOM - https://github.com/radix-ui/primitives/issues/3353 */}
        <DialogPrimitive.Overlay className="cn-modal-dialog-overlay">
          <DialogPrimitive.Content
            ref={ref}
            className={cn(contentVariants({ size }), className)}
            onCloseAutoFocus={handleCloseAutoFocus}
            {...props}
          >
            {!hideClose && (
              <DialogPrimitive.Close asChild>
                <Button className="cn-modal-dialog-close" variant="transparent" iconOnly ignoreIconOnlyTooltip>
                  <IconV2 name="xmark" />
                </Button>
              </DialogPrimitive.Close>
            )}
            {children}
          </DialogPrimitive.Content>
        </DialogPrimitive.Overlay>
      </DialogPrimitive.Portal>
    )
  }
)
Content.displayName = 'Dialog.Content'

interface HeaderProps extends HTMLAttributes<HTMLDivElement> {
  icon?: IconV2NamesType
  logo?: LogoV2NamesType
  theme?: 'default' | 'warning' | 'danger'
}

const Header = forwardRef<HTMLDivElement, HeaderProps>(
  ({ className, icon, logo, theme = 'default', children, ...props }, ref) => {
    const { t } = useTranslation()
    if (icon && logo) {
      console.warn('Dialog.Header: Cannot use both icon and logo props together')
      return null
    }

    // Find the title and description from children
    let title: React.ReactNode = null
    let description: React.ReactNode = null

    Children.forEach(children, child => {
      if (isValidElement(child)) {
        if (child.type === Title) {
          title = child
        } else if (child.type === Description) {
          description = child
        }
      }
    })

    return (
      <div className={cn(headerVariants({ theme }), className)} ref={ref} {...props}>
        <div className="cn-modal-dialog-header-title-row">
          {icon && (
            <div className="cn-modal-dialog-header-icon">
              <IconV2 name={icon} size="xl" />
            </div>
          )}
          {logo && (
            <div className="cn-modal-dialog-header-logo">
              <LogoV2 name={logo} size="md" />
            </div>
          )}
          {title}
        </div>
        {description ? (
          description
        ) : (
          <Description className="sr-only">
            {t('component:dialog.noDescription', 'No description available')}
          </Description>
        )}
      </div>
    )
  }
)
Header.displayName = 'Dialog.Header'

const Title = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title className={cn('cn-modal-dialog-title', className)} {...props} ref={ref} />
))
Title.displayName = 'Dialog.Title'

const Description = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <DialogPrimitive.Description className={cn('cn-modal-dialog-description', className)} {...props} ref={ref} />
  )
)
Description.displayName = 'Dialog.Description'

interface BodyProps {
  className?: string
  classNameContent?: string
  children: ReactNode
}

const Body = forwardRef<HTMLDivElement, BodyProps>(({ className, classNameContent, children, ...props }, ref) => (
  <ScrollArea
    className={cn('cn-modal-dialog-body', className)}
    classNameContent={cn('cn-modal-dialog-body-content', classNameContent)}
    ref={ref}
    {...props}
  >
    {children}
  </ScrollArea>
))
Body.displayName = 'Dialog.Body'

const Footer = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div className={cn('cn-modal-dialog-footer', className)} {...props} ref={ref} />
))
Footer.displayName = 'Dialog.Footer'

const Close = forwardRef<HTMLButtonElement, ButtonProps>(({ children, className, ...props }, ref) => (
  <DialogPrimitive.Close asChild>
    <Button variant="secondary" className={className} {...props} ref={ref}>
      {children}
    </Button>
  </DialogPrimitive.Close>
))
Close.displayName = 'Dialog.Close'

const Trigger = forwardRef<HTMLButtonElement, ButtonProps>(({ onClick, id, ...props }, ref) => {
  const triggerId = useTriggerId(id)
  const focusManager = useDialogFocusManager()

  const dialogContext = useContext(DialogOpenContext)
  const isInsideDialog = dialogContext !== undefined

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (focusManager) {
      console.log('🚀 ~ focusManager:', focusManager)
      focusManager.registerTrigger({ triggerId, triggerElement: event.currentTarget })
    }
    onClick?.(event)
  }

  const trigger = <Button ref={ref} onClick={handleClick} {...props} id={triggerId} />

  if (isInsideDialog && !onClick) {
    return <DialogPrimitive.Trigger asChild>{trigger}</DialogPrimitive.Trigger>
  }

  return trigger
})
Trigger.displayName = 'DialogTrigger'

const Dialog = {
  Root,
  Trigger,
  Content,
  Close,
  Header,
  Title,
  Description,
  Body,
  Footer
}

export { Dialog, DialogProvider, useCustomDialogTrigger }
