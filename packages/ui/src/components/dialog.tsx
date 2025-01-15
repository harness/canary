import * as React from 'react'

import { Button, Icon } from '@/components'
import { usePortal } from '@/context'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { cn } from '@utils/cn'

const Dialog = DialogPrimitive.Root

const DialogTrigger = DialogPrimitive.Trigger

const DialogPortal = DialogPrimitive.Portal

const DialogClose = DialogPrimitive.Close

interface DialogOverlayProps extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay> {
  onClick?: () => void
}

const DialogOverlay = React.forwardRef<React.ElementRef<typeof DialogPrimitive.Overlay>, DialogOverlayProps>(
  ({ className, onClick, ...props }, ref) => (
    <DialogPrimitive.Overlay
      ref={ref}
      className={cn('fixed inset-0 z-50 bg-background-7/50', className)}
      {...props}
      onClick={onClick}
    />
  )
)
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

interface DialogContentProps extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  onOverlayClick?: () => void
}

const DialogContent = React.forwardRef<React.ElementRef<typeof DialogPrimitive.Content>, DialogContentProps>(
  ({ className, children, onOverlayClick, ...props }, ref) => {
    const { portalContainer } = usePortal()
    const mainContent: React.ReactNode[] = []
    let footer: React.ReactNode = null

    React.Children.forEach(children, child => {
      if (React.isValidElement(child) && child.type === DialogFooter) {
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
            'bg-background-1 shadow-1 fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] flex-col overflow-hidden rounded-10 border duration-200',
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
          <DialogPrimitive.Close className="absolute right-3 top-[18px] disabled:pointer-events-none" asChild>
            <Button size="icon" variant="custom" className="text-icons-4 hover:text-icons-2">
              <Icon name="close" size={16} />
              <span className="sr-only">Close</span>
            </Button>
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPortal>
    )
  }
)
DialogContent.displayName = DialogPrimitive.Content.displayName

const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-col space-y-2 text-center sm:text-left', className)} {...props} />
)
DialogHeader.displayName = 'DialogHeader'

const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
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

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn('text-foreground-1 text-xl font-semibold tracking-tight', className)}
    {...props}
  />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description ref={ref} className={cn('text-foreground-2 text-sm', className)} {...props} />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription
}
