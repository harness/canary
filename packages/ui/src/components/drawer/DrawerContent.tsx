import { ComponentPropsWithoutRef, ElementRef, forwardRef, useRef } from 'react'

import { Button, IconV2 } from '@/components'
import { usePortal } from '@/context'
import { cn } from '@/utils'
import { cva, VariantProps } from 'class-variance-authority'
import { Drawer as DrawerPrimitive } from 'vaul'

import { useDrawerContext } from './drawer-context'
import { DrawerOverlay } from './DrawerOverlay'

const drawerContentVariants = cva('cn-drawer-content', {
  variants: {
    size: {
      xs: 'cn-drawer-content-xs',
      sm: 'cn-drawer-content-sm',
      md: 'cn-drawer-content-md',
      lg: 'cn-drawer-content-lg'
    },
    direction: {
      right: 'cn-drawer-content-right',
      left: 'cn-drawer-content-left',
      top: 'cn-drawer-content-top',
      bottom: 'cn-drawer-content-bottom'
    }
  },
  defaultVariants: {
    size: 'sm',
    direction: 'right'
  }
})

export type DrawerContentVariantsSize = VariantProps<typeof drawerContentVariants>['size']
export type DrawerContentVariantsDirection = VariantProps<typeof drawerContentVariants>['direction']

export type DrawerContentProps = ComponentPropsWithoutRef<typeof DrawerPrimitive.Content> & {
  size?: DrawerContentVariantsSize
  hideClose?: boolean
  overlayClassName?: string
  forceWithOverlay?: boolean
}

export const DrawerContent = forwardRef<ElementRef<typeof DrawerPrimitive.Content>, DrawerContentProps>(
  (
    {
      className,
      children,
      size = 'sm',
      hideClose = false,
      overlayClassName,
      forceWithOverlay = false,
      onOpenAutoFocus,
      ...props
    },
    ref
  ) => {
    const triggerRef = useRef<HTMLButtonElement>(null)
    const { portalContainer } = usePortal()
    const { direction, modal } = useDrawerContext()

    const withCustomOverlay = forceWithOverlay && modal === false

    const Content = (
      <DrawerPrimitive.Content
        ref={ref}
        className={cn(
          drawerContentVariants({ size, direction: direction as DrawerContentVariantsDirection }),
          className
        )}
        {...props}
        onOpenAutoFocus={e => {
          e.preventDefault()
          onOpenAutoFocus?.(e)
          if (!triggerRef.current || onOpenAutoFocus) return
          triggerRef.current.focus()
        }}
      >
        <button className="sr-only" ref={triggerRef} aria-hidden="true" tabIndex={-1} />
        {!hideClose && (
          <DrawerPrimitive.Close asChild>
            <Button className="cn-drawer-close-button" variant="transparent" iconOnly ignoreIconOnlyTooltip>
              <IconV2 className="cn-drawer-close-button-icon" name="xmark" skipSize />
            </Button>
          </DrawerPrimitive.Close>
        )}
        {children}
      </DrawerPrimitive.Content>
    )

    return (
      <DrawerPrimitive.Portal container={portalContainer}>
        {/* !!! */}
        {/* For the scroll to work when using the Drawer with modal === true in Shadow DOM, the Overlay needs to wrap the Content */}
        {/* Here’s the issue for the scroll bug in Shadow DOM, works same for Vaul - https://github.com/radix-ui/primitives/issues/3353 */}
        {modal ? (
          <DrawerOverlay className={overlayClassName} withCustomOverlay={withCustomOverlay}>
            {Content}
          </DrawerOverlay>
        ) : (
          <>
            <DrawerOverlay className={overlayClassName} withCustomOverlay={withCustomOverlay} />
            {Content}
          </>
        )}
      </DrawerPrimitive.Portal>
    )
  }
)
DrawerContent.displayName = 'DrawerContent'
