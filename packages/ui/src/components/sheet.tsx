import { ComponentPropsWithoutRef, ElementRef, forwardRef, HTMLAttributes, MouseEvent } from 'react'

import { usePortal, useTheme } from '@/context'
import * as SheetPrimitive from '@radix-ui/react-dialog'
import { cn } from '@utils/cn'
import { cva, type VariantProps } from 'class-variance-authority'

import { Button } from './button'
import { IconV2 } from './icon-v2'

const SheetRoot = SheetPrimitive.Root

const SheetTrigger = SheetPrimitive.Trigger

const SheetPortal = SheetPrimitive.Portal

interface SheetOverlayProps extends ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay> {
  modal?: boolean
  handleClose?: ((event: MouseEvent<HTMLDivElement>) => void) | (() => void)
}

const SheetOverlay = forwardRef<ElementRef<typeof SheetPrimitive.Overlay>, SheetOverlayProps>(
  ({ className, modal, handleClose, ...props }, ref) => {
    const { isLightTheme } = useTheme()

    if (modal) {
      return (
        <SheetPrimitive.Overlay
          className={cn(
            'bg-cn-1/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50',
            { 'bg-cn-backdrop': isLightTheme },
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
          'layer-high bg-cn-1/50 fixed left-0 top-0 h-full w-full',
          { 'bg-cn-backdrop': isLightTheme },
          className
        )}
        onClick={e => handleClose?.(e)}
      />
    )
  }
)
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName

const sheetVariants = cva('bg-cn-1 p-cn-xl gap-cn-md fixed z-50 shadow-4 transition ease-in-out', {
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
  extends ComponentPropsWithoutRef<typeof SheetPrimitive.Content>,
    VariantProps<typeof sheetVariants> {
  hideCloseButton?: boolean
  handleClose?: () => void
  modal?: boolean
  overlayClassName?: string
  closeClassName?: string
}

const SheetContent = forwardRef<ElementRef<typeof SheetPrimitive.Content>, SheetContentProps>(
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
      <SheetPrimitive.Content ref={ref} className={cn(sheetVariants({ side, className }))} {...props}>
        {children}
        {!hideCloseButton && (
          <SheetPrimitive.Close
            className="absolute right-1 top-2 flex items-center justify-center transition-colors disabled:pointer-events-none"
            asChild
          >
            <Button className={closeClassName} variant="ghost" size="sm" iconOnly ignoreIconOnlyTooltip>
              <IconV2 name="xmark" />
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

const SheetHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div className={cn('flex flex-col space-y-2 text-center sm:text-left', className)} {...props} ref={ref} />
))
SheetHeader.displayName = 'SheetHeader'

const SheetFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div
    className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2', className)}
    {...props}
    ref={ref}
  />
))
SheetFooter.displayName = 'SheetFooter'

const SheetTitle = forwardRef<
  ElementRef<typeof SheetPrimitive.Title>,
  ComponentPropsWithoutRef<typeof SheetPrimitive.Title>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Title ref={ref} className={cn('text-cn-1 text-4 font-semibold', className)} {...props} />
))
SheetTitle.displayName = SheetPrimitive.Title.displayName

const SheetDescription = forwardRef<
  ElementRef<typeof SheetPrimitive.Description>,
  ComponentPropsWithoutRef<typeof SheetPrimitive.Description>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Description ref={ref} className={cn('text-cn-3 text-2', className)} {...props} />
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
