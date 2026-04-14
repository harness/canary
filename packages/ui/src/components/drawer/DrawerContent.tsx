import { ComponentPropsWithoutRef, ElementRef, forwardRef, useCallback, useEffect, useRef } from 'react'

import { usePortal, useRegisterDialog } from '@/context'
import { cn, useMergeRefs } from '@/utils'
import { cva, VariantProps } from 'class-variance-authority'
import { Drawer as DrawerPrimitive } from 'vaul'

import { useDrawerContext } from './drawer-context'
import { DrawerOverlay } from './DrawerOverlay'

const DRAWER_TRANSFORMS = {
  right: 'scale(0.990741) translate3d(-16px, 0px, 0px)',
  left: 'scale(0.990741) translate3d(16px, 0px, 0px)',
  top: 'scale(0.990741) translate3d(0px, 16px, 0px)',
  bottom: 'scale(0.990741) translate3d(0px, -16px, 0px)'
} as const

const DRAWER_TRANSFORM_DEFAULT = 'scale(1) translate3d(0px, 0px, 0px)'
const DRAWER_TRANSITION = 'transform 500ms cubic-bezier(0.32, 0.72, 0, 1)'

const drawerContentVariants = cva('cn-drawer-content', {
  variants: {
    size: {
      '2xs': 'cn-drawer-content-2xs',
      xs: 'cn-drawer-content-xs',
      sm: 'cn-drawer-content-sm',
      md: 'cn-drawer-content-md',
      lg: 'cn-drawer-content-lg',
      xl: 'cn-drawer-content-xl',
      full: 'cn-drawer-content-full'
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
  overlayClassName?: string
  forceWithOverlay?: boolean
}

export const DrawerContent = forwardRef<ElementRef<typeof DrawerPrimitive.Content>, DrawerContentProps>(
  (
    {
      className,
      children,
      size = 'sm',
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
    const { direction, modal, hasOpenChild } = useDrawerContext()
    const ref = useMergeRefs([_ref, contentRef])

    // Use ref to avoid stale closures in MutationObserver
    const hasOpenChildRef = useRef(hasOpenChild)
    const directionRef = useRef(direction)

    useEffect(() => {
      hasOpenChildRef.current = hasOpenChild
      directionRef.current = direction
    }, [hasOpenChild, direction])

    useEffect(() => {
      if (!contentRef.current) return

      const element = contentRef.current

      const applyTransform = () => {
        const isChildOpen = hasOpenChildRef.current
        const dir = directionRef.current

        if (isChildOpen) {
          element.style.transform = DRAWER_TRANSFORMS[dir as keyof typeof DRAWER_TRANSFORMS] || DRAWER_TRANSFORMS.right
          element.style.transition = DRAWER_TRANSITION
        } else {
          element.style.transform = DRAWER_TRANSFORM_DEFAULT
          element.style.transition = DRAWER_TRANSITION
        }
      }

      // Apply transform initially
      applyTransform()

      // Watch for Vaul's inline style changes and re-apply our transform
      const observer = new MutationObserver(() => {
        applyTransform()
      })

      if (hasOpenChild) {
        observer.observe(element, {
          attributes: true,
          attributeFilter: ['style']
        })
      }

      return () => {
        observer.disconnect()
      }
    }, [hasOpenChild])

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
