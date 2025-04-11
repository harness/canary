import * as React from 'react'

import { usePortal, useTheme } from '@/context'
import * as SheetPrimitive from '@radix-ui/react-dialog'
import { cn } from '@utils/cn'
import { cva, type VariantProps } from 'class-variance-authority'

import { Button } from './button'
import { Icon } from './icon'

const SheetRoot = SheetPrimitive.Root

const SheetTrigger = SheetPrimitive.Trigger

const SheetPortal = SheetPrimitive.Portal

interface SheetOverlayProps extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay> {
  modal?: boolean
  handleClose?: ((event: React.MouseEvent<HTMLDivElement>) => void) | (() => void)
}

const SheetOverlay = React.forwardRef<React.ElementRef<typeof SheetPrimitive.Overlay>, SheetOverlayProps>(
  ({ className, modal, handleClose, ...props }, ref) => {
    const { isLightTheme } = useTheme()

    if (modal) {
      return (
        <SheetPrimitive.Overlay
          className={cn(
            'bg-cn-background-1/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50',
            { 'bg-cn-background-backdrop': isLightTheme },
            className
          )}
          {...props}
          ref={ref}
        />
      )
    }

    return (
      <div
        aria-hidden="true"
        className={cn(
          'layer-high bg-cn-background-1/50 fixed left-0 top-0 h-full w-full',
          { 'bg-cn-background-backdrop': isLightTheme },
          className
        )}
        onClick={e => handleClose?.(e)}
      />
    )
  }
)
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName

const sheetVariants = cva('fixed z-50 gap-4 bg-cn-background p-6 shadow-lg transition ease-in-out', {
  variants: {
    side: {
      top: 'inset-x-0 top-0 border-b',
      bottom: 'inset-x-0 bottom-0 border-t',
      left: 'inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm',
      right: 'inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm'
    }
  },
  defaultVariants: {
    side: 'right'
  }
})

interface SheetContentProps
  extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content>,
    VariantProps<typeof sheetVariants> {
  hideCloseButton?: boolean
  handleClose?: () => void
  modal?: boolean
  overlayClassName?: string
  closeClassName?: string
}

const SheetContent = React.forwardRef<React.ElementRef<typeof SheetPrimitive.Content>, SheetContentProps>(
  (
    {
      side = 'right',
      hideCloseButton = false,
      modal = true,
      handleClose,
      className,
      children,
      overlayClassName,
      closeClassName,
      ...props
    },
    ref
  ) => {
    const { portalContainer } = usePortal()

    const content = (
      <SheetPrimitive.Content ref={ref} className={cn(sheetVariants({ side }), className)} {...props}>
        {children}
        {!hideCloseButton && (
          <SheetPrimitive.Close
            className="absolute right-1 top-2 flex items-center justify-center transition-colors disabled:pointer-events-none"
            asChild
          >
            <Button
              className={cn('text-icons-4 hover:text-icons-2 focus:ring-0 focus-visible:outline-none', closeClassName)}
              variant="custom"
              size="icon"
            >
              <Icon name="close" size={16} />
              <span className="sr-only">Close</span>
            </Button>
          </SheetPrimitive.Close>
        )}
      </SheetPrimitive.Content>
    )

    return (
      <SheetPortal container={portalContainer}>
        {modal ? (
          <SheetOverlay modal={modal} className={overlayClassName} handleClose={handleClose || props.onClick}>
            {content}
          </SheetOverlay>
        ) : (
          <>
            <SheetOverlay modal={modal} className={overlayClassName} handleClose={handleClose || props.onClick} />
            {content}
          </>
        )}
      </SheetPortal>
    )
  }
)
SheetContent.displayName = SheetPrimitive.Content.displayName

const SheetHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-col space-y-2 text-center sm:text-left', className)} {...props} />
)
SheetHeader.displayName = 'SheetHeader'

const SheetFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2', className)} {...props} />
)
SheetFooter.displayName = 'SheetFooter'

const SheetTitle = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Title ref={ref} className={cn('text-cn-foreground text-lg font-semibold', className)} {...props} />
))
SheetTitle.displayName = SheetPrimitive.Title.displayName

const SheetDescription = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Description ref={ref} className={cn('text-cn-foreground-3 text-sm', className)} {...props} />
))
SheetDescription.displayName = SheetPrimitive.Description.displayName

const Sheet = {
  Root: SheetRoot,
  Trigger: SheetTrigger,
  Content: SheetContent,
  Header: SheetHeader,
  Footer: SheetFooter,
  Title: SheetTitle,
  Description: SheetDescription
}

export { Sheet }
