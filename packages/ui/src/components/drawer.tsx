import {
  ComponentProps,
  ComponentPropsWithoutRef,
  ElementRef,
  forwardRef,
  HTMLAttributes,
  PropsWithChildren,
  useEffect,
  useRef,
  useState
} from 'react'

import { ScrollArea } from '@/components'
import { usePortal } from '@/context'
import { cn } from '@utils/cn'
import { Drawer as DrawerPrimitive } from 'vaul'

const DrawerRoot = ({
  shouldScaleBackground = true,
  nested = false,
  ...props
}: ComponentProps<typeof DrawerPrimitive.Root>) =>
  nested ? (
    <DrawerPrimitive.NestedRoot shouldScaleBackground={shouldScaleBackground} {...props} />
  ) : (
    <DrawerPrimitive.Root shouldScaleBackground={shouldScaleBackground} {...props} />
  )
DrawerRoot.displayName = 'DrawerRoot'

const LazyDrawer = ({
  children,
  open,
  onOpenChange,
  unmountOnClose = false,
  ...props
}: ComponentProps<typeof DrawerPrimitive.Root> & { unmountOnClose?: boolean }) => {
  const [hasRendered, setHasRendered] = useState(open || false)

  const prevOpenState = useRef(false)

  useEffect(() => {
    if (!prevOpenState.current && open) {
      setHasRendered(true)
      prevOpenState.current = true
    }
    // if unmountOnClose=true set hasRendered with delay
    else if (unmountOnClose && prevOpenState.current && !open) {
      const timer = setTimeout(() => {
        setHasRendered(false)
        prevOpenState.current = false
      }, 250)

      return () => clearTimeout(timer)
    }
  }, [open])

  return (
    <DrawerRoot open={open} onOpenChange={onOpenChange} {...props}>
      {hasRendered ? children : null}
    </DrawerRoot>
  )
}

const DrawerTrigger = DrawerPrimitive.Trigger

const DrawerPortal = DrawerPrimitive.Portal

const DrawerClose = ({
  srOnly = false,
  className,
  ...props
}: ComponentProps<typeof DrawerPrimitive.Close> & {
  srOnly?: boolean
}) => {
  return <DrawerPrimitive.Close className={cn(className, { 'sr-only': srOnly })} {...props} />
}

const DrawerOverlay = forwardRef<
  ElementRef<typeof DrawerPrimitive.Overlay>,
  ComponentPropsWithoutRef<typeof DrawerPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Overlay ref={ref} className={cn('fixed inset-0 z-50 dialog-backdrop', className)} {...props} />
))
DrawerOverlay.displayName = DrawerPrimitive.Overlay.displayName

const DrawerContent = forwardRef<
  ElementRef<typeof DrawerPrimitive.Content>,
  ComponentPropsWithoutRef<typeof DrawerPrimitive.Content> & { nested?: boolean }
>(({ className, children, nested = false, ...props }, ref) => {
  const { portalContainer } = usePortal()

  return (
    <DrawerPortal container={portalContainer}>
      <DrawerOverlay
        className={cn({
          'bg-transparent': nested
        })}
      >
        <DrawerPrimitive.Content
          ref={ref}
          className={cn(
            'bg-cn-background-2 fixed inset-y-0 right-0 z-50 w-1/4 border-l border-cn-borders-3 flex flex-col',
            className
          )}
          {...props}
        >
          {children}
        </DrawerPrimitive.Content>
      </DrawerOverlay>
    </DrawerPortal>
  )
})
DrawerContent.displayName = 'DrawerContent'

const DrawerInner = ({
  children,
  className,
  viewportClassName
}: PropsWithChildren<ComponentPropsWithoutRef<typeof ScrollArea>>) => {
  return (
    <ScrollArea
      className={cn('flex-1', className)}
      viewportClassName={cn(
        'p-6 before:absolute before:inset-x-0 before:top-0 before:h-6 before:bg-gradient-to-b before:from-cn-background-2 before:to-transparent before:z-10 after:z-10 after:absolute after:inset-x-0 after:bottom-0 after:h-6 after:bg-gradient-to-t after:from-cn-background-2 after:to-transparent',
        viewportClassName
      )}
    >
      {children}
    </ScrollArea>
  )
}
DrawerInner.displayName = 'DrawerInner'

const DrawerHeader = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-col gap-y-5 border-b px-6 py-5 border-cn-borders-3', className)} {...props} />
)
DrawerHeader.displayName = 'DrawerHeader'

const DrawerFooter = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex justify-between gap-2 border-t border-cn-borders-3 px-6 py-5', className)} {...props} />
)
DrawerFooter.displayName = 'DrawerFooter'

const DrawerTitle = forwardRef<
  ElementRef<typeof DrawerPrimitive.Title>,
  ComponentPropsWithoutRef<typeof DrawerPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Title
    ref={ref}
    className={cn('text-xl font-medium leading-tight text-cn text-cn-foreground-1', className)}
    {...props}
  />
))
DrawerTitle.displayName = DrawerPrimitive.Title.displayName

const DrawerDescription = forwardRef<
  ElementRef<typeof DrawerPrimitive.Description>,
  ComponentPropsWithoutRef<typeof DrawerPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Description ref={ref} className={cn('text-cn-foreground-3 text-sm', className)} {...props} />
))
DrawerDescription.displayName = DrawerPrimitive.Description.displayName

const Drawer = {
  Root: DrawerRoot,
  Lazy: LazyDrawer,
  Portal: DrawerPortal,
  Overlay: DrawerOverlay,
  Trigger: DrawerTrigger,
  Close: DrawerClose,
  Content: DrawerContent,
  Header: DrawerHeader,
  Footer: DrawerFooter,
  Title: DrawerTitle,
  Description: DrawerDescription,
  Inner: DrawerInner
}

export { Drawer }
