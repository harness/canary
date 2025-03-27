import { Children, ComponentPropsWithoutRef, ElementRef, forwardRef, HTMLAttributes, isValidElement } from 'react'

import { Button, Icon } from '@/components'
import { usePortal } from '@/context'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { cn } from '@utils/cn'

const DialogRoot = DialogPrimitive.Root

const DialogTrigger = DialogPrimitive.Trigger

const DialogPortal = DialogPrimitive.Portal

interface DialogOverlayProps extends ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay> {
  onClick?: () => void
}

const DialogOverlay = forwardRef<ElementRef<typeof DialogPrimitive.Overlay>, DialogOverlayProps>(
  ({ className, onClick, ...props }, ref) => (
    <DialogPrimitive.Overlay
      ref={ref}
      className={cn(
        'fixed inset-0 z-50 bg-background-7/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
        className
      )}
      {...props}
      onClick={onClick}
    />
  )
)
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

interface DialogContentProps extends ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  onOverlayClick?: () => void
  isShowCloseIcon?: boolean
}

const DialogContent = forwardRef<ElementRef<typeof DialogPrimitive.Content>, DialogContentProps>(
  ({ className, children, onOverlayClick, isShowCloseIcon = true, ...props }, ref) => {
    const { portalContainer } = usePortal()
    const mainContent: React.ReactNode[] = []
    let footer: React.ReactNode = null

    Children.forEach(children, child => {
      if (isValidElement(child) && child.type === DialogFooter) {
        footer = child
      } else {
        mainContent.push(child)
      }
    })

    return (
      <DialogPortal container={portalContainer}>
        <DialogOverlay onClick={onOverlayClick} />
        <DialogPrimitive.Content
          ref={ref}
          className={cn(
            'bg-background-1 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] shadow-1 fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] flex-col overflow-hidden rounded-10 border duration-200',
            className
          )}
          {...props}
        >
          <div
            className={cn('flex flex-col gap-y-6 overflow-y-auto p-5 max-h-full', {
              'pb-7': footer
            })}
          >
            {mainContent}
          </div>
          {footer}
          {isShowCloseIcon && (
            <DialogPrimitive.Close className="absolute right-3 top-3.5 disabled:pointer-events-none" asChild>
              <Button size="icon" variant="custom" className="text-icons-4 hover:text-icons-2">
                <Icon name="close" size={16} />
                <span className="sr-only">Close</span>
              </Button>
            </DialogPrimitive.Close>
          )}
        </DialogPrimitive.Content>
      </DialogPortal>
    )
  }
)
DialogContent.displayName = DialogPrimitive.Content.displayName

const DialogHeader = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-col space-y-2 text-center sm:text-left', className)} {...props} />
)
DialogHeader.displayName = 'DialogHeader'

const DialogFooter = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'bg-background-2 border-borders-1 relative mt-auto flex h-fit flex-col-reverse gap-x-4 border-t px-5 py-4 sm:flex-row sm:justify-end',
      'before:from-background-1 before:pointer-events-none before:absolute before:inset-x-0 before:-top-px before:h-3 before:-translate-y-full before:bg-gradient-to-t before:to-transparent',
      className
    )}
    {...props}
  />
)
DialogFooter.displayName = 'DialogFooter'

const DialogTitle = forwardRef<
  ElementRef<typeof DialogPrimitive.Title>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn('text-foreground-1 text-xl font-semibold tracking-tight', className)}
    {...props}
  />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

const DialogDescription = forwardRef<
  ElementRef<typeof DialogPrimitive.Description>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description ref={ref} className={cn('text-foreground-2 text-sm', className)} {...props} />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

const Dialog = {
  Root: DialogRoot,
  Trigger: DialogTrigger,
  Content: DialogContent,
  Header: DialogHeader,
  Footer: DialogFooter,
  Title: DialogTitle,
  Description: DialogDescription
}

export { Dialog }
