import { ComponentPropsWithoutRef, ElementRef, forwardRef } from 'react'

import { Button, Icon } from '@/components'
import { usePortal } from '@/context'
import { cn } from '@/utils'
import { cva, VariantProps } from 'class-variance-authority'
import { Drawer as DrawerPrimitive } from 'vaul'

import { useDrawerContext } from './drawer-context'
import { DrawerOverlay } from './DrawerOverlay'

const drawerContentVariants = cva('cn-drawer-content', {
  variants: {
    size: {
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
}

export const DrawerContent = forwardRef<ElementRef<typeof DrawerPrimitive.Content>, DrawerContentProps>(
  ({ className, children, size = 'sm', hideClose = false, ...props }, ref) => {
    const { portalContainer } = usePortal()
    const { direction } = useDrawerContext()

    return (
      <DrawerPrimitive.Portal container={portalContainer}>
        <DrawerOverlay>
          <DrawerPrimitive.Content
            ref={ref}
            className={cn(
              drawerContentVariants({
                size,
                direction: direction as DrawerContentVariantsDirection
              }),
              className
            )}
            {...props}
          >
            {!hideClose && (
              <DrawerPrimitive.Close asChild>
                <Button className="cn-drawer-close-button" variant="transparent" iconOnly>
                  <Icon className="cn-drawer-close-button-icon" name="close" skipSize />
                </Button>
              </DrawerPrimitive.Close>
            )}
            {children}
          </DrawerPrimitive.Content>
        </DrawerOverlay>
      </DrawerPrimitive.Portal>
    )
  }
)
DrawerContent.displayName = 'DrawerContent'
