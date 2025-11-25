import { ComponentPropsWithoutRef, ElementRef, forwardRef, useCallback, useRef } from 'react'

import { Button, IconV2 } from '@/components'
import { usePortal, useRegisterDialog } from '@/context'
import { cn, useMergeRefs } from '@/utils'
import { cva, VariantProps } from 'class-variance-authority'
import { Drawer as DrawerPrimitive } from 'vaul'

import { useDrawerContext } from './drawer-context'
import { DrawerOverlay } from './DrawerOverlay'

const drawerContentVariants = cva('cn-drawer-content', {
  variants: {
    size: {
      '2xs': 'cn-drawer-content-2xs',
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
      onCloseAutoFocus: _onCloseAutoFocus,
      ...props
    },
    _ref
  ) => {
    const contentRef = useRef<HTMLDivElement>(null)
    const { portalContainer } = usePortal()
    const { direction, modal } = useDrawerContext()
    const ref = useMergeRefs([_ref, contentRef])

    const { handleCloseAutoFocus } = useRegisterDialog()

    const onCloseAutoFocus = useCallback(
      (e: Event) => {
        handleCloseAutoFocus()
        _onCloseAutoFocus?.(e)
      },
      [_onCloseAutoFocus, handleCloseAutoFocus]
    )

    const withCustomOverlay = forceWithOverlay && modal === false

    const Content = (
      <DrawerPrimitive.Content
        ref={ref}
        className={cn(
          drawerContentVariants({ size, direction: direction as DrawerContentVariantsDirection }),
          className
        )}
        {...props}
        onCloseAutoFocus={onCloseAutoFocus}
        onOpenAutoFocus={e => {
          e.preventDefault()
          onOpenAutoFocus?.(e)
          if (!contentRef.current || onOpenAutoFocus) return
          contentRef.current.focus()
        }}
      >
        {!hideClose && (
          <DrawerPrimitive.Close asChild>
            <Button className="cn-drawer-close-button" variant="ghost" iconOnly ignoreIconOnlyTooltip>
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
